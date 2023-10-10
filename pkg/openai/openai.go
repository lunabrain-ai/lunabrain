package openai

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/gen/jsonschema"
	"github.com/pkg/errors"
	"github.com/reactivex/rxgo/v2"
	"github.com/samber/lo"
	gopenai "github.com/sashabaranov/go-openai"
	"github.com/tmc/langchaingo/chains"
	"github.com/tmc/langchaingo/documentloaders"
	"github.com/tmc/langchaingo/llms"
	"github.com/tmc/langchaingo/llms/openai"
	"github.com/tmc/langchaingo/schema"
	"github.com/tmc/langchaingo/textsplitter"
	"google.golang.org/protobuf/reflect/protoreflect"
	"log/slog"
	"regexp"
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

func cleanText(text string) string {
	// Trim spaces from start and end
	text = strings.TrimSpace(text)

	// Replace multiple spaces with a single space
	spaceRegex := regexp.MustCompile(`\s+`)
	text = spaceRegex.ReplaceAllString(text, " ")

	// Remove non-ASCII characters
	asciiOnlyRegex := regexp.MustCompile(`[^\x00-\x7F]+`)
	text = asciiOnlyRegex.ReplaceAllString(text, "")
	return text
}

func (c *Agent) Prompt(
	ctx context.Context,
	prompt string,
) (string, error) {
	// TODO breadchris set a max limit for prompt?
	llm, err := openai.NewChat(openai.WithToken(c.config.APIKey), openai.WithModel("gpt-3.5-turbo-0613"))
	if err != nil {
		return "", err
	}

	clean := cleanText(prompt)
	slog.Debug("calling openai", "prompt", clean)
	completion, err := llm.Generate(ctx, [][]schema.ChatMessage{
		{
			schema.HumanChatMessage{Content: clean},
		},
	})
	if err != nil {
		return "", err
	}
	slog.Debug("openai response", "completion", completion)
	return completion[0].Text, nil
}

func (c *Agent) PromptToProto(
	ctx context.Context,
	prompt string,
	p protoreflect.ProtoMessage,
) error {
	jsonSchemaDef, err := jsonschema.Assets.ReadFile(fmt.Sprintf("%s.json", p.ProtoReflect().Descriptor().Name()))
	if err != nil {
		return err
	}

	var funcCall FunctionCallJSON
	err = json.Unmarshal(jsonSchemaDef, &funcCall)
	if err != nil {
		return err
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

	slog.Debug("calling openai", "prompt", cleanText(prompt), "json schema", string(jsonSchemaDef))
	call, err := c.Call(ctx, prompt, funcs)
	if err != nil {
		return err
	}

	if call == nil {
		return errors.New("no call was found")
	}
	err = json.Unmarshal([]byte(call.Arguments), p)
	if err != nil {
		return err
	}
	return nil
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
