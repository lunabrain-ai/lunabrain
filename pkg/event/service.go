package event

import (
	"context"
	connectgo "github.com/bufbuild/connect-go"
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/event"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/event/eventconnect"
	"github.com/lunabrain-ai/lunabrain/pkg/http"
)

var ProviderSet = wire.NewSet(
	NewEntStore,
	NewService,
	NewConfig,
)

type Service struct {
	sess   *http.SessionManager
	store  *EntStore
	config Config
}

var _ eventconnect.EventServiceHandler = (*Service)(nil)

func NewService(
	sess *http.SessionManager,
	store *EntStore,
	config Config,
) *Service {
	return &Service{
		sess:   sess,
		store:  store,
		config: config,
	}
}

func (s Service) Send(ctx context.Context, c *connectgo.Request[event.Metric]) (*connectgo.Response[event.SendResponse], error) {
	if s.config.SaveEvents {
		err := s.store.SaveEvent(ctx, c.Msg)
		if err != nil {
			return nil, err
		}
	}
	return connectgo.NewResponse(&event.SendResponse{
		Id: "",
	}), nil
}
