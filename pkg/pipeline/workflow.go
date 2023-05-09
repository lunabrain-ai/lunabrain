package pipeline

import (
	"context"
	"encoding/json"
	"github.com/google/uuid"
	"github.com/google/wire"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/lunabrain-ai/lunabrain/gen/python"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize"
	normcont "github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize/content"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/transform"
	transcont "github.com/lunabrain-ai/lunabrain/pkg/pipeline/transform/content"
	"github.com/lunabrain-ai/lunabrain/pkg/publish"
	"github.com/lunabrain-ai/lunabrain/pkg/store/bucket"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
)

type Workflow interface {
	ProcessContent(ctx context.Context, content *genapi.Content) (uuid.UUID, error)
}

type ContentWorkflow struct {
	db          db.Store
	normalizer  normalize.Normalizer
	summarizer  transform.Summarizer
	categorizer transform.Categorizer
	fileStore   *bucket.Bucket
	publisher   publish.Publisher
}

var ProviderSet = wire.NewSet(
	NewContentWorkflow,
	wire.Bind(new(Workflow), new(*ContentWorkflow)),
)

func (s *ContentWorkflow) ProcessContent(ctx context.Context, content *genapi.Content) (uuid.UUID, error) {
	// The workflow should be:
	// 1. Receive content from the API
	// 2. Normalize the content
	// 3. Save the content to the database
	// 4. Return the ID of the audio

	var (
		metadata []byte
		err      error
	)
	if content.Metadata != nil {
		metadata, err = json.Marshal(content.Metadata)
		if err != nil {
			return uuid.UUID{}, errors.Wrapf(err, "unable to marshal metadata for content %s", content.Type.String())
		}
	}

	contentID, err := s.db.SaveContent(content.Type, string(content.Data), metadata)
	if err != nil {
		return uuid.UUID{}, errors.Wrapf(err, "unable to save content %s", content.Type.String())
	}

	var (
		normalContent []*normcont.Content
	)

	if content.Type == genapi.ContentType_TEXT {
		normalContent, err = s.normalizer.NormalizeText(string(content.Data))
		if err != nil {
			return uuid.UUID{}, errors.Wrapf(err, "unable to normalize text content")
		}
	}

	if content.Type == genapi.ContentType_AUDIO {
		err = s.fileStore.Bucket.WriteAll(ctx, contentID.String(), content.Data, nil)
		if err != nil {
			return uuid.UUID{}, errors.Wrapf(err, "unable to save audio content to bucket")
		}

		normalContent, err = s.normalizer.NormalizeFile(contentID.String(), "audio")
		if err != nil {
			return uuid.UUID{}, errors.Wrapf(err, "unable to normalize audio content")
		}
	}

	if content.Type == genapi.ContentType_URL {
		normalContent, err = s.processURL(content)
		if err != nil {
			return uuid.UUID{}, errors.Wrapf(err, "unable to process url content")
		}
	}

	normalContentIDs, err := s.db.SaveNormalizedContent(contentID, normalContent)
	if err != nil {
		return uuid.UUID{}, errors.Wrapf(err, "unable to save normalized content")
	}

	// TODO breadchris what is this step called? post normalization? Is the indexer in charge of summarizing?
	for i, c := range normalContent {
		var transformedContent []*transcont.Content

		switch c.NormalizerID {
		case genapi.NormalizerID_URL_HTML:
			_, err = s.db.SaveLocatedContent(contentID, c.Data)
			if err != nil {
				return uuid.UUID{}, errors.Wrapf(err, "unable to save located content")
			}
		case genapi.NormalizerID_URL_ARTICLE:
			fallthrough
		case genapi.NormalizerID_TEXT_CLEAN:
			fallthrough
		case genapi.NormalizerID_AUDIO_TRANSCRIPT:
			fallthrough
		case genapi.NormalizerID_URL_YOUTUBE_TRANSCRIPT:
			summary, err := s.summarizer.SummarizeTextWithSummarizer(c.Data, python.Summarizer_LANGCHAIN)
			if err != nil {
				return uuid.UUID{}, errors.Wrapf(err, "unable to summarize normalized content")
			}
			transformedContent = append(transformedContent, summary)

			categorizers := []python.Categorizer{
				python.Categorizer_T5_TAG,
				python.Categorizer_KEYBERT,
			}
			for _, categorizer := range categorizers {
				categories, err := s.categorizer.CategorizeTextWithCategorizer(c.Data, categorizer)
				if err != nil {
					return uuid.UUID{}, errors.Wrapf(err, "unable to categorize normalized content")
				}
				transformedContent = append(transformedContent, categories)
			}
		}

		_, err = s.db.SaveTransformedContent(normalContentIDs[i], transformedContent)
		if err != nil {
			return uuid.UUID{}, errors.Wrapf(err, "unable to save transformed content")
		}
	}

	err = s.publisher.Publish(contentID)
	if err != nil {
		return uuid.UUID{}, errors.Wrapf(err, "unable to publish normalized content")
	}
	return contentID, nil
}

func (s *ContentWorkflow) processURL(content *genapi.Content) ([]*normcont.Content, error) {
	url := string(content.Data)
	log.Info().Str("url", url).Msg("normalizing url")

	crawl := false
	ops := content.GetUrlOptions()
	if ops != nil {
		crawl = ops.Crawl
	}

	return s.normalizer.NormalizeURL(url, crawl)
}

func NewContentWorkflow(
	db db.Store,
	normalizer normalize.Normalizer,
	summarizer transform.Summarizer,
	categorizer transform.Categorizer,
	fileStore *bucket.Bucket,
	publisher publish.Publisher,
) *ContentWorkflow {
	return &ContentWorkflow{
		db:          db,
		normalizer:  normalizer,
		summarizer:  summarizer,
		categorizer: categorizer,
		fileStore:   fileStore,
		publisher:   publisher,
	}
}
