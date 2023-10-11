package protoflow

import (
	"context"
	connect_go "github.com/bufbuild/connect-go"
	genapi "github.com/lunabrain-ai/lunabrain/gen"
	"github.com/reactivex/rxgo/v2"
	"log/slog"
)

func (p *Protoflow) Infer(ctx context.Context, c *connect_go.Request[genapi.InferRequest], c2 *connect_go.ServerStream[genapi.InferResponse]) error {
	var content string
	for _, t := range c.Msg.Text {
		content += t + " "
	}
	var (
		obs rxgo.Observable
		err error
	)
	obs, err = p.openai.Ask(c.Msg.Prompt, content)
	if err != nil {
		return err
	}

	var resErr error
	<-obs.ForEach(func(item any) {
		s, ok := item.(string)
		if !ok {
			return
		}
		if err := c2.Send(&genapi.InferResponse{
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

func (p *Protoflow) AnalyzeConversation(ctx context.Context, c *connect_go.Request[genapi.AnalyzeConversationRequest]) (*connect_go.Response[genapi.AnalyzeConversationResponse], error) {
	ac := &genapi.AnalyzeConversationResponse{}
	err := p.openai.PromptToProto(ctx, c.Msg.Text, ac)
	if err != nil {
		return nil, err
	}
	return connect_go.NewResponse(ac), nil
}
