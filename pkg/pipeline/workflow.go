package pipeline

import (
	"context"
	"encoding/json"
	"github.com/google/uuid"
	"github.com/google/wire"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/lunabrain-ai/lunabrain/gen/python"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize/text"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize/types"
	"github.com/lunabrain-ai/lunabrain/pkg/store"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	"path"
)

type Workflow interface {
	ProcessContent(ctx context.Context, content *genapi.Content) (uuid.UUID, error)
}

type ContentWorkflow struct {
	db         db.Store
	normalizer normalize.Normalizer
	summarizer text.Summarizer
	fileStore  *store.Files
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
		normalContent []*types.Content
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

		normalContent, err = s.normalizer.NormalizeFile(path.Join(s.fileStore.Location, contentID.String()), "audio")
		if err != nil {
			return uuid.UUID{}, errors.Wrapf(err, "unable to normalize audio content")
		}
	}

	if content.Type == genapi.ContentType_URL {
		url := string(content.Data)
		log.Info().Str("url", url).Msg("normalizing url")

		crawl := false
		ops := content.GetUrlOptions()
		if ops != nil {
			crawl = ops.Crawl
		}

		normalContent, err = s.normalizer.NormalizeURL(url, crawl)
		if err != nil {
			return uuid.UUID{}, errors.Wrapf(err, "unable to normalize url content")
		}
	}

	for _, c := range normalContent {
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
				return uuid.UUID{}, errors.Wrapf(err, "unable to summarize youtube transcript")
			}
			normalContent = append(normalContent, summary)
		}
	}

	_, err = s.db.SaveNormalizedContent(contentID, normalContent)
	if err != nil {
		return uuid.UUID{}, errors.Wrapf(err, "unable to save normalized content")
	}
	return contentID, nil
}

func NewContentWorkflow(
	db db.Store,
	normalizer normalize.Normalizer,
	summarizer text.Summarizer,
	fileStore *store.Files,
) *ContentWorkflow {
	return &ContentWorkflow{
		db:         db,
		normalizer: normalizer,
		summarizer: summarizer,
		fileStore:  fileStore,
	}
}
