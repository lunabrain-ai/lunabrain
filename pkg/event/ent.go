package event

import (
	"context"
	"github.com/lunabrain-ai/lunabrain/pkg/ent"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/event"
)

type EntStore struct {
	client *ent.Client
}

func NewEntStore(client *ent.Client) *EntStore {
	return &EntStore{
		client: client,
	}
}

func (s *EntStore) SaveHTTPEvent(ctx context.Context, m *event.HTTPRequest) error {
	_, err := s.client.Event.
		Create().
		SetData(&event.Metric{
			Type: &event.Metric_Http{
				Http: m,
			},
		}).
		Save(ctx)
	return err
}

func (s *EntStore) SaveEvent(ctx context.Context, m *event.Metric) error {
	_, err := s.client.Event.
		Create().
		SetData(m).
		Save(ctx)
	return err
}
