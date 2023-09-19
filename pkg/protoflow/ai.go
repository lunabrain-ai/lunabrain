package protoflow

import (
	"context"
	"encoding/json"
	"fmt"
	connect_go "github.com/bufbuild/connect-go"
	genapi "github.com/lunabrain-ai/lunabrain/gen"
	"github.com/lunabrain-ai/lunabrain/gen/jsonschema"
	"github.com/pkg/errors"
	"github.com/reactivex/rxgo/v2"
	"github.com/rs/zerolog/log"
	"github.com/tmc/langchaingo/llms"
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
			log.Error().Err(err).Msg("error sending token")
		}
	}, func(err error) {
		log.Error().Err(err).Msg("error while infering")
		resErr = err
	}, func() {
		log.Debug().Msg("infer complete")
	})
	return resErr
}

type FunctionCallJSON struct {
	Schema      string                `json:"$schema"`
	Ref         string                `json:"$ref"`
	Definitions map[string]Definition `json:"definitions"`
}

type Definition struct {
	Properties           json.RawMessage `json:"properties"`
	AdditionalProperties bool            `json:"additionalProperties"`
	Type                 string          `json:"type"`
	Title                string          `json:"title"`
}

func (p *Protoflow) AnalyzeConversation(ctx context.Context, c *connect_go.Request[genapi.AnalyzeConversationRequest]) (*connect_go.Response[genapi.AnalyzeConversationResponse], error) {
	name := "AnalyzeConversationResponse"
	getPhoneNumbers, err := jsonschema.Assets.ReadFile(fmt.Sprintf("%s.json", name))
	if err != nil {
		return nil, err
	}

	var funcCall FunctionCallJSON
	err = json.Unmarshal(getPhoneNumbers, &funcCall)
	if err != nil {
		return nil, err
	}

	var funcs []llms.FunctionDefinition
	for k, v := range funcCall.Definitions {
		f := llms.FunctionDefinition{
			Name:        k,
			Description: v.Title,
			Parameters:  v,
		}
		funcs = append(funcs, f)
	}

	call, err := p.openai.Call(ctx, c.Msg.Text, funcs)
	if err != nil {
		return nil, err
	}

	if call == nil {
		return nil, errors.New("no call was found")
	}

	var resp genapi.AnalyzeConversationResponse
	for _, f := range funcs {
		if f.Name == name {
			err := json.Unmarshal([]byte(call.Arguments), &resp)
			if err != nil {
				return nil, err
			}
			break
		}
	}
	return connect_go.NewResponse(&resp), nil
}
