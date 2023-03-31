package openai

import (
	"github.com/PullRequestInc/go-gpt3"
	"github.com/google/wire"
)

var (
	ProviderSet = wire.NewSet(
		NewConfig,
		NewOpenAIClient,
	)
)

// TODO breadchris finish

type OpenAIClient interface {
	Summarize()
}

type openAIClient struct {
	client gpt3.Client
}

func (s *openAIClient) Summarize() {
}

func NewOpenAIClient(config Config) *openAIClient {
	return &openAIClient{
		gpt3.NewClient(config.APIKey),
	}
}
