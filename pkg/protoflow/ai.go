package protoflow

import (
	"context"
	"encoding/json"
	connect_go "github.com/bufbuild/connect-go"
	genapi "github.com/lunabrain-ai/lunabrain/gen"
	"github.com/lunabrain-ai/lunabrain/gen/jsonschema"
	"github.com/pkg/errors"
	"github.com/reactivex/rxgo/v2"
	"github.com/rs/zerolog/log"
	"github.com/tmc/langchaingo/llms"
	"strings"
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
	if c.Msg.Call {
		obs, err = p.callFunction(ctx, content)
	} else {
		obs, err = p.openai.Ask(c.Msg.Prompt, content)
	}
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

func (p *Protoflow) callFunction(ctx context.Context, content string) (rxgo.Observable, error) {
	getPhoneNumbers, err := jsonschema.Assets.ReadFile("GetPhoneNumbersResponse.json")
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

	return rxgo.Create([]rxgo.Producer{func(ctx context.Context, next chan<- rxgo.Item) {
		call, err := p.openai.Call(ctx, content, funcs)
		if err != nil {
			log.Debug().Err(err).Msg("error calling llm")
			next <- rxgo.Error(err)
			return
		}

		if call == nil {
			next <- rxgo.Error(errors.New("no call was found"))
			return
		}

		for _, f := range funcs {
			if f.Name == call.Name {
				if f.Name == "GetPhoneNumbersResponse" {
					var resp genapi.GetPhoneNumbersResponse
					err := json.Unmarshal([]byte(call.Arguments), &resp)
					if err != nil {
						next <- rxgo.Error(err)
						return
					}
					next <- rxgo.Of(strings.Join(resp.PhoneNumbers, ", ") + " " + resp.Summary)
					break
				}
			}
		}
	}}, rxgo.WithContext(ctx)), nil
}
