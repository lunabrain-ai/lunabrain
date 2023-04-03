package api

import (
	"context"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/pkg/errors"
)

type Server struct {
	db       db.Store
	workflow pipeline.Workflow
}

func (s *Server) Save(ctx context.Context, contents *genapi.Contents) (*genapi.ContentIDs, error) {
	var ids []*genapi.ContentID
	for _, c := range contents.Contents {
		id, err := s.workflow.ProcessContent(ctx, c)
		if err != nil {
			return nil, err
		}
		ids = append(ids, &genapi.ContentID{
			Id: id.String(),
		})
	}
	return &genapi.ContentIDs{
		ContentIDs: ids,
	}, nil
}

func (s *Server) Search(ctx context.Context, query *genapi.Query) (*genapi.Results, error) {
	content, _, err := s.db.GetAllContent(0, 10)
	if err != nil {
		return nil, errors.Wrapf(err, "unable to get stored content")
	}

	var storedContent []*genapi.StoredContent
	for _, c := range content {
		var normalContent []*genapi.NormalizedContent
		for _, n := range c.NormalizedContent {
			var transformedContent []*genapi.TransformedContent
			for _, t := range n.TransformedContent {
				transformedContent = append(transformedContent, &genapi.TransformedContent{
					Data:          t.Data,
					TransformerID: genapi.TransformerID(t.TransformerID),
				})
			}

			normalContent = append(normalContent, &genapi.NormalizedContent{
				Data:         n.Data,
				NormalizerID: genapi.NormalizerID(n.NormalizerID),
				ContentID:    n.ContentID.String(),
				Transformed:  transformedContent,
			})
		}

		storedContent = append(storedContent, &genapi.StoredContent{
			Content: &genapi.Content{
				Id:        c.ID.String(),
				Data:      []byte(c.Data),
				Type:      genapi.ContentType(c.Type),
				Metadata:  nil,
				CreatedAt: c.CreatedAt.String(),
			},
			Normalized: normalContent,
		})
	}
	return &genapi.Results{
		StoredContent: storedContent,
	}, nil
}

func NewAPIServer(
	db db.Store,
	workflow pipeline.Workflow,
) *Server {
	return &Server{
		db:       db,
		workflow: workflow,
	}
}
