package content

import (
	"context"
	connect_go "github.com/bufbuild/connect-go"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/gen/content"
	"github.com/lunabrain-ai/lunabrain/gen/content/contentconnect"
	"github.com/lunabrain-ai/lunabrain/pkg/db"
	"github.com/lunabrain-ai/lunabrain/pkg/db/model"
	"github.com/pkg/errors"
)

type Service struct {
	db *db.Store
}

var _ contentconnect.ContentServiceHandler = (*Service)(nil)

func (s *Service) Save(ctx context.Context, c *connect_go.Request[content.Contents]) (*connect_go.Response[content.ContentIDs], error) {
	var ids []string
	for _, ct := range c.Msg.Contents {
		id, err := s.db.SaveContent(ct)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to save content")
		}
		ids = append(ids, id.String())

		// TODO breadchris upsert tags
	}
	return connect_go.NewResponse(&content.ContentIDs{ContentIds: ids}), nil
}

func (s *Service) Search(ctx context.Context, c *connect_go.Request[content.Query]) (*connect_go.Response[content.Results], error) {
	var (
		err error
		ct  []model.Content
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
		ct = append(ct, *singleContent)
	} else {
		ct, _, err = s.db.GetAllContent(0, 10)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to get stored content")
		}
	}

	var storedContent []*content.StoredContent
	for _, cn := range ct {
		storedContent = append(storedContent, &content.StoredContent{
			Id:      cn.ID.String(),
			Content: cn.Data,
		})
	}
	return connect_go.NewResponse(&content.Results{StoredContent: storedContent}), nil
}

func (s *Service) Delete(ctx context.Context, c *connect_go.Request[content.ContentIDs]) (*connect_go.Response[content.ContentIDs], error) {
	for _, ct := range c.Msg.ContentIds {
		err := s.db.DeleteContent(ct)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to save content")
		}
	}
	return connect_go.NewResponse(&content.ContentIDs{ContentIds: c.Msg.GetContentIds()}), nil
}

func NewAPIServer(
	db *db.Store,
) *Service {
	return &Service{
		db: db,
	}
}
