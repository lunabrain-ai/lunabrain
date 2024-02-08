package content

import (
	"context"
	connect_go "github.com/bufbuild/connect-go"
	"github.com/lunabrain-ai/lunabrain/pkg/gen"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/content"
	"github.com/reactivex/rxgo/v2"
	"log/slog"
)

func (s *Service) Infer(ctx context.Context, r *connect_go.Request[content.InferRequest], c2 *connect_go.ServerStream[content.InferResponse]) error {
	var (
		obs rxgo.Observable
		err error
	)
	obs, err = s.openai.PromptStream(ctx, r.Msg.Prompt)
	if err != nil {
		return err
	}

	var resErr error
	<-obs.ForEach(func(item any) {
		s, ok := item.(string)
		if !ok {
			return
		}
		if err := c2.Send(&content.InferResponse{
			Text: s,
		}); err != nil {
			slog.Error("error sending token", "error", err)
		}
	}, func(err error) {
		slog.Error("error while infering", "error", err)
		resErr = err
	}, func() {
		slog.Debug("infer complete")
	})
	return resErr
}

func (s *Service) AnalyzeConversation(ctx context.Context, c *connect_go.Request[gen.AnalyzeConversationRequest]) (*connect_go.Response[gen.AnalyzeConversationResponse], error) {
	ac := &gen.AnalyzeConversationResponse{}
	err := s.openai.PromptToProto(ctx, c.Msg.Text, ac)
	if err != nil {
		return nil, err
	}
	return connect_go.NewResponse(ac), nil
}
