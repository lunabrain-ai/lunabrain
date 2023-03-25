package api

import (
	"context"
	"encoding/json"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/text"
	"github.com/lunabrain-ai/lunabrain/pkg/store"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	"path"
)

type Server struct {
	fileStore  *store.Files
	db         db.Store
	normalizer normalize.Normalizer
	summarizer text.Summarizer
}

func (s Server) Save(ctx context.Context, content *genapi.Content) (*genapi.ContentID, error) {
	data, err := json.Marshal(content.Metadata)
	if err != nil {
		return nil, errors.Wrapf(err, "unable to marshal metadata for content %s", content.Type.String())
	}

	contentID, err := s.db.SaveContent(content.Type, string(content.Data), data)
	if err != nil {
		return nil, errors.Wrapf(err, "unable to save content %s", content.Type.String())
	}

	var (
		normalText string
	)

	if content.Type == genapi.ContentType_TEXT {
		normalText, err = s.normalizer.NormalizeText(string(content.Data))
		if err != nil {
			return nil, errors.Wrapf(err, "unable to normalize text content")
		}
	}

	if content.Type == genapi.ContentType_AUDIO {
		err = s.fileStore.Bucket.WriteAll(ctx, contentID.String(), content.Data, nil)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to save audio content to bucket")
		}

		normalText, err = s.normalizer.NormalizeFile(path.Join(s.fileStore.Location, contentID.String()), "audio")
		if err != nil {
			return nil, errors.Wrapf(err, "unable to normalize audio content")
		}
	}

	if content.Type == genapi.ContentType_URL {
		url := string(content.Data)
		log.Info().Str("url", url).Msg("normalizing url")

		var page string
		normalText, page, err = s.normalizer.NormalizeURL(url)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to normalize url content")
		}

		_, err = s.db.SaveLocatedContent(contentID, page)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to save located content")
		}

		log.Info().Str("url", url).Msg("summarizing url")

		normalText, err = s.summarizer.SummarizeText(normalText)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to summarize text content")
		}
	}

	_, err = s.db.SaveNormalizedContent(contentID, normalText)
	if err != nil {
		return nil, errors.Wrapf(err, "unable to save normalized content")
	}

	return &genapi.ContentID{
		Id: contentID.String(),
	}, nil
}

func (s Server) Search(ctx context.Context, query *genapi.Query) (*genapi.Results, error) {
	content, err := s.db.GetStoredContent()
	if err != nil {
		return nil, errors.Wrapf(err, "unable to get stored content")
	}

	var storedContent []*genapi.StoredContent
	for _, c := range content {
		normalData := ""
		if len(c.NormalizedContent) > 0 {
			normalData = c.NormalizedContent[0].Data
		}

		storedContent = append(storedContent, &genapi.StoredContent{
			Content: &genapi.Content{
				Data:      []byte(c.Data),
				Type:      genapi.ContentType(c.Type),
				Metadata:  nil,
				CreatedAt: c.CreatedAt.String(),
			},
			Normalized: &genapi.NormalizedContent{
				Data: normalData,
			},
		})
	}
	return &genapi.Results{
		StoredContent: storedContent,
	}, nil
}

func NewAPIServer(
	db db.Store,
	fileStore *store.Files,
	normalizer normalize.Normalizer,
	summarizer text.Summarizer,
) *Server {
	return &Server{
		db:         db,
		fileStore:  fileStore,
		normalizer: normalizer,
		summarizer: summarizer,
	}
}
