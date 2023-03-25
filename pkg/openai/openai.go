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

func NewOpenAIClient(config Config) gpt3.Client {
	return gpt3.NewClient(config.APIKey)
}
