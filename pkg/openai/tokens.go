package openai

import (
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	tokenizer "github.com/samber/go-gpt-3-encoder"
	"github.com/sashabaranov/go-openai"
	"strings"
)

const (
	promptTokenCount = 3
)

type SplitMessage struct {
	Msg        openai.ChatCompletionMessage
	Rest       string
	TokenCount int
}

func fillMessageContext(baseTokenCount int, msg openai.ChatCompletionMessage, modelDetails ModelDetails) (*SplitMessage, error) {
	calcTokenCount, err := tokenCountForMessage(msg, modelDetails)
	if err != nil {
		return nil, errors.Wrapf(err, "failed to encode prompt data")
	}
	if baseTokenCount+calcTokenCount < modelDetails.MaxTokens {
		log.Debug().
			Int("base token count", baseTokenCount).
			Int("token count", calcTokenCount).
			Int("max", modelDetails.MaxTokens).
			Msg("context is small enough")
		return &SplitMessage{
			Msg:        msg,
			Rest:       "",
			TokenCount: calcTokenCount,
		}, nil
	}

	// attempt to split the chat context into chunks
	chunker, err := NewChunker()
	if err != nil {
		return nil, errors.Wrapf(err, "failed to create chunker")
	}
	// TODO breadchris determine what a good chunk size would be
	chunks, err := chunker.SplitText(msg.Content, 16)
	if err != nil {
		return nil, errors.Wrapf(err, "failed to split text")
	}
	if len(chunks) == 0 {
		return nil, errors.New("no chunks found")
	}

	var chunkIdx int
	sep := " "
	for chunkIdx, _ = range chunks {
		newCntJoined := strings.Join(chunks[:chunkIdx+1], sep)
		m := openai.ChatCompletionMessage{
			Content: newCntJoined,
			Role:    msg.Role,
			Name:    msg.Name,
		}
		// TODO breadchris we could incrementally adding tokens instead of guessing and checking like this
		tc, err := tokenCountForMessage(m, modelDetails)
		if err != nil {
			return nil, errors.Wrapf(err, "failed to encode prompt data")
		}
		if baseTokenCount+tc > modelDetails.MaxTokens {
			break
		}
		calcTokenCount = tc
	}
	if len(chunks) == 1 {
		// TODO breadchris address the case where a single chunk is too large
		return &SplitMessage{
			Msg: openai.ChatCompletionMessage{
				Content: chunks[0],
				Role:    msg.Role,
				Name:    msg.Name,
			},
			Rest:       "",
			TokenCount: baseTokenCount + calcTokenCount,
		}, nil
	}
	return &SplitMessage{
		Msg: openai.ChatCompletionMessage{
			Content: strings.Join(chunks[:chunkIdx+1], sep),
			Role:    msg.Role,
			Name:    msg.Name,
		},
		Rest:       strings.Join(chunks[chunkIdx+1:], sep),
		TokenCount: baseTokenCount + calcTokenCount,
	}, nil
}

func tokenCountForMessage(msg openai.ChatCompletionMessage, modelDetails ModelDetails) (int, error) {
	encoder, err := tokenizer.NewEncoder()
	if err != nil {
		return 0, err
	}

	numTokens := 0
	numTokens += modelDetails.TokensPerMsg
	encoded, err := encoder.Encode(msg.Content)
	if err != nil {
		return 0, err
	}
	numTokens += len(encoded)
	role, err := encoder.Encode(msg.Role)
	if err != nil {
		return 0, err
	}
	numTokens += len(role)
	name, err := encoder.Encode(msg.Name)
	if err != nil {
		return 0, err
	}
	numTokens += len(name)
	if msg.Name != "" {
		numTokens += modelDetails.TokensPerName
	}
	numTokens += promptTokenCount
	return numTokens, nil
}
