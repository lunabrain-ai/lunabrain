package openai

import (
	"github.com/sashabaranov/go-openai"
	"testing"
)

type ChunkChatTest struct {
	c          openai.ChatCompletionMessage
	maxTokens  int
	tokenCount int
	rest       string
}

func TestChunkChatCtx(t *testing.T) {
	md := models[openai.GPT3Dot5Turbo]
	c := openai.ChatCompletionMessage{
		Role:    openai.ChatMessageRoleUser,
		Content: "Hello, my name is",
	}
	clarge := openai.ChatCompletionMessage{
		Role:    openai.ChatMessageRoleUser,
		Content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum. Donec in efficitur leo. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam",
	}
	tests := []ChunkChatTest{
		{c: c, tokenCount: 5 + md.TokensPerMsg + 1 + promptTokenCount},
		{c: clarge, tokenCount: 69 + md.TokensPerMsg + 1 + promptTokenCount, maxTokens: 10, rest: "adipiscing elit. Vivamus lacinia odio vitae vestibulum. Donec in efficitur leo. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam"},
	}
	for _, tt := range tests {
		t.Run("chunking chat context", func(t *testing.T) {
			var m ModelDetails
			if tt.maxTokens > 0 {
				m = models[openai.GPT3Dot5Turbo]
				m.MaxTokens = tt.maxTokens
			} else {
				m = models[openai.GPT3Dot5Turbo]
			}
			sm, err := fillMessageContext(0, tt.c, m)
			if err != nil {
				t.Errorf("ChunkChatCtx() error = %v", err)
			}
			if sm.Rest != tt.rest {
				t.Errorf("ChunkChatCtx() got = %v, want %v", sm.Rest, tt.rest)
			}
			if sm.TokenCount != tt.tokenCount {
				t.Errorf("ChunkChatCtx() got = %v, want %v", sm.TokenCount, tt.tokenCount)
			}
		})
	}
}
