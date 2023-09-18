package openai

import (
	"context"
	"github.com/google/wire"
	"github.com/reactivex/rxgo/v2"
	"github.com/samber/lo"
	gopenai "github.com/sashabaranov/go-openai"
	"github.com/tmc/langchaingo/chains"
	"github.com/tmc/langchaingo/documentloaders"
	"github.com/tmc/langchaingo/llms"
	"github.com/tmc/langchaingo/llms/openai"
	"github.com/tmc/langchaingo/schema"
	"github.com/tmc/langchaingo/textsplitter"
	"strings"
)

var ProviderSet = wire.NewSet(
	NewConfig,
	NewAgent,
)

func NewAgent(c Config) (*Agent, error) {
	return &Agent{
		config: c,
	}, nil
}

type Agent struct {
	config Config
}

func (c *Agent) GenerateImages(ctx context.Context, prompt string) ([]string, error) {
	client := gopenai.NewClient(c.config.APIKey)
	resp, err := client.CreateImage(ctx, gopenai.ImageRequest{
		Prompt: prompt,
	})
	if err != nil {
		return nil, err
	}
	return lo.Map(resp.Data, func(inner gopenai.ImageResponseDataInner, _ int) string {
		return inner.URL
	}), nil
}

func (c *Agent) Call(
	ctx context.Context,
	content string,
	functions []llms.FunctionDefinition,
) (*schema.FunctionCall, error) {
	llm, err := openai.NewChat(openai.WithToken(c.config.APIKey), openai.WithModel("gpt-3.5-turbo-0613"))
	if err != nil {
		return nil, err
	}

	completion, err := llm.Call(ctx, []schema.ChatMessage{
		schema.HumanChatMessage{Content: content},
	}, llms.WithFunctions(functions))
	if err != nil {
		return nil, err
	}
	return completion.FunctionCall, nil
}

func (c *Agent) Ask(
	prompt string,
	content string,
) (rxgo.Observable, error) {
	client, err := openai.New(openai.WithToken(c.config.APIKey), openai.WithModel("gpt-4"))
	if err != nil {
		return nil, err
	}

	events := make(chan rxgo.Item)
	client.CallbacksHandler = NewHandler(events)

	go func() {
		defer close(events)

		// TODO breadchris figure out how to cram more into context?
		refineQAChain := chains.LoadRefineQA(client)
		docs, err := documentloaders.NewText(strings.NewReader(content)).LoadAndSplit(context.Background(),
			textsplitter.NewRecursiveCharacter(),
		)
		answer, err := chains.Call(context.Background(), refineQAChain, map[string]any{
			"input_documents": docs,
			"question":        prompt,
		})
		if err != nil {
			return
		}
		events <- rxgo.Of(answer["text"])
	}()
	return rxgo.FromChannel(events), nil
}
