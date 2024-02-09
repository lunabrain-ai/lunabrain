package openai

import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/jsonschema"
	"github.com/pkg/errors"
	"github.com/reactivex/rxgo/v2"
	tokenizer "github.com/samber/go-gpt-3-encoder"
	"github.com/samber/lo"
	gopenai "github.com/sashabaranov/go-openai"
	"github.com/tmc/langchaingo/chains"
	"github.com/tmc/langchaingo/documentloaders"
	"github.com/tmc/langchaingo/llms"
	"github.com/tmc/langchaingo/llms/openai"
	"github.com/tmc/langchaingo/schema"
	"github.com/tmc/langchaingo/textsplitter"
	"google.golang.org/protobuf/reflect/protoreflect"
	"io"
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

func (s *Agent) GenerateImages(ctx context.Context, prompt string) ([]string, error) {
	client := gopenai.NewClient(s.config.APIKey)
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

type ModelDetails struct {
	MaxTokens     int
	TokensPerMsg  int
	TokensPerName int
}

var (
	models = map[string]ModelDetails{
		gopenai.GPT3Dot5Turbo: {
			MaxTokens:     4096,
			TokensPerMsg:  4,
			TokensPerName: -1,
		},
		gopenai.GPT4: {
			MaxTokens:     8000,
			TokensPerMsg:  3,
			TokensPerName: 1,
		},
	}
)

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

func (s *Agent) Prompt(
	ctx context.Context,
	prompt string,
) (string, error) {
	// TODO breadchris set a max limit for prompt?
	llm, err := openai.NewChat(openai.WithToken(s.config.APIKey), openai.WithModel("gpt-3.5-turbo-0613"))
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

func (s *Agent) PromptToProto(
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
	call, err := s.Call(ctx, prompt, funcs)
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

func (s *Agent) Call(
	ctx context.Context,
	content string,
	functions []llms.FunctionDefinition,
) (*schema.FunctionCall, error) {
	llm, err := openai.NewChat(openai.WithToken(s.config.APIKey), openai.WithModel("gpt-3.5-turbo-0613"))
	if err != nil {
		return nil, err
	}

	llm.CallbacksHandler = NewHandler()

	completion, err := llm.Call(ctx, []schema.ChatMessage{
		schema.HumanChatMessage{Content: content},
	}, llms.WithFunctions(functions))
	if err != nil {
		return nil, err
	}
	return completion.FunctionCall, nil
}

func (s *Agent) PromptStream(
	ctx context.Context,
	prompt string,
) (rxgo.Observable, error) {
	c := gopenai.NewClient(s.config.APIKey)
	req := gopenai.ChatCompletionRequest{
		Model:     gopenai.GPT3Dot5Turbo,
		MaxTokens: 0,
		Messages: []gopenai.ChatCompletionMessage{
			{
				Role:    gopenai.ChatMessageRoleUser,
				Content: prompt,
			},
		},
		Stream: true,
	}

	modelDetails := models[req.Model]
	respTokenCount, err := validateChatCtx(req.Messages, modelDetails)
	if err != nil {
		return nil, err
	}
	req.MaxTokens = respTokenCount

	stream, err := c.CreateChatCompletionStream(ctx, req)
	if err != nil {
		return nil, err
	}

	events := make(chan rxgo.Item)
	go func() {
		defer stream.Close()
		defer close(events)
		for {
			response, err := stream.Recv()
			if errors.Is(err, io.EOF) {
				return
			}

			if err != nil {
				events <- rxgo.Error(err)
				return
			}
			events <- rxgo.Of(response.Choices[0].Delta.Content)
		}
	}()
	return rxgo.FromChannel(events), nil
}

func (s *Agent) Ask(
	prompt string,
	content string,
) (rxgo.Observable, error) {
	client, err := openai.New(openai.WithToken(s.config.APIKey), openai.WithModel("gpt-4"))
	if err != nil {
		return nil, err
	}

	events := make(chan rxgo.Item)
	client.CallbacksHandler = NewHandler()

	go func() {
		defer close(events)

		// TODO breadchris figure out how to cram more into context?
		refineQAChain := chains.LoadRefineQA(client)
		docs, err := documentloaders.NewText(strings.NewReader(content)).LoadAndSplit(context.Background(),
			textsplitter.NewRecursiveCharacter(),
		)
		input := map[string]any{
			"question": prompt,
		}
		if len(docs) > 0 {
			input["input_documents"] = docs
		}
		answer, err := chains.Call(context.Background(), refineQAChain, input)
		if err != nil {
			slog.Error("error calling refineQAChain", "error", err)
			return
		}
		events <- rxgo.Of(answer["text"])
	}()
	return rxgo.FromChannel(events), nil
}

func validateChatCtx(chatCtx []gopenai.ChatCompletionMessage, modelDetails ModelDetails) (int, error) {
	tokenCount, err := numTokensFromMessages(chatCtx, modelDetails)
	if err != nil {
		return 0, errors.Wrapf(err, "failed to encode prompt data")
	}
	diff := modelDetails.MaxTokens - 4 - tokenCount
	if diff < 0 {
		return 0, fmt.Errorf("chat context is too long")
	}
	return diff, nil
}

func numTokensFromMessages(chatCtx []gopenai.ChatCompletionMessage, modelDetails ModelDetails) (int, error) {
	encoder, err := tokenizer.NewEncoder()
	if err != nil {
		return 0, err
	}

	numTokens := 0
	for _, msg := range chatCtx {
		numTokens += modelDetails.TokensPerMsg
		encoded, err := encoder.Encode(msg.Content)
		if err != nil {
			return 0, err
		}
		numTokens += len(encoded)
		if msg.Name != "" {
			numTokens += modelDetails.TokensPerName
		}
	}
	numTokens += 3
	return numTokens, nil
}
