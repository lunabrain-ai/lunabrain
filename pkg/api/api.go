package api

import (
	"context"
	connect_go "github.com/bufbuild/connect-go"
	"github.com/google/uuid"
	gen "github.com/lunabrain-ai/lunabrain/gen"
	"github.com/lunabrain-ai/lunabrain/gen/genconnect"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db/model"
	"github.com/pkg/errors"
)

type Server struct {
	db       db.Store
	workflow pipeline.Workflow
}

var _ genconnect.APIHandler = (*Server)(nil)

func (s *Server) Save(ctx context.Context, c *connect_go.Request[gen.Contents]) (*connect_go.Response[gen.ContentIDs], error) {
	var ids []*gen.ContentID
	for _, c := range c.Msg.Contents {
		id, err := s.workflow.ProcessContent(ctx, c)
		if err != nil {
			return nil, err
		}
		ids = append(ids, &gen.ContentID{
			Id: id.String(),
		})
	}
	return connect_go.NewResponse(&gen.ContentIDs{ContentIDs: ids}), nil
}

func (s *Server) Search(ctx context.Context, c *connect_go.Request[gen.Query]) (*connect_go.Response[gen.Results], error) {
	var (
		err     error
		content []model.Content
	)
	if c.Msg.ContentID != "" {
		parsedID, err := uuid.Parse(c.Msg.ContentID)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to parse content id")
		}
		singleContent, err := s.db.GetContentByID(parsedID)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to get stored content")
		}
		content = append(content, *singleContent)
	} else {
		content, _, err = s.db.GetAllContent(0, 10)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to get stored content")
		}
	}

	var storedContent []*gen.StoredContent
	for _, c := range content {
		var normalContent []*gen.NormalizedContent
		for _, n := range c.NormalizedContent {
			var transformedContent []*gen.TransformedContent
			for _, t := range n.TransformedContent {
				transformedContent = append(transformedContent, &gen.TransformedContent{
					Data:          t.Data,
					TransformerID: gen.TransformerID(t.TransformerID),
				})
			}

			normalContent = append(normalContent, &gen.NormalizedContent{
				Data:         n.Data,
				NormalizerID: gen.NormalizerID(n.NormalizerID),
				ContentID:    n.ContentID.String(),
				Transformed:  transformedContent,
			})
		}

		storedContent = append(storedContent, &gen.StoredContent{
			Content: &gen.Content{
				Id:        c.ID.String(),
				Data:      []byte(c.Data),
				Type:      gen.ContentType(c.Type),
				Metadata:  nil,
				CreatedAt: c.CreatedAt.String(),
			},
			Normalized: normalContent,
		})
	}
	return connect_go.NewResponse(&gen.Results{StoredContent: storedContent}), nil
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
