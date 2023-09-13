package openai

import (
	tokenizer "github.com/samber/go-gpt-3-encoder"
	"log"
	"strings"
)

type Chunker struct {
	encoder  *tokenizer.Encoder
	splitFns []func(string) []string
}

func NewChunker() (*Chunker, error) {
	encoder, err := tokenizer.NewEncoder()
	if err != nil {
		return nil, err
	}

	var splitFns []func(string) []string
	allSeps := []string{" ", ",", "."}
	for _, sep := range allSeps {
		splitFn := splitBySep(sep, true)
		splitFns = append(splitFns, splitFn)
	}

	splitFns = append(splitFns, func(text string) []string {
		return strings.Split(text, "")
	})
	return &Chunker{
		encoder:  encoder,
		splitFns: splitFns,
	}, nil
}

func splitTextKeepSeparator(text string, separator string) []string {
	parts := strings.Split(text, separator)
	var result []string
	for i, s := range parts {
		if i > 0 {
			result = append(result, separator+s)
		} else {
			result = append(result, s)
		}
	}

	// Filter empty strings
	nonEmptyResult := []string{}
	for _, s := range result {
		if s != "" {
			nonEmptyResult = append(nonEmptyResult, s)
		}
	}
	return nonEmptyResult
}

func splitBySep(sep string, keepSep bool) func(string) []string {
	if keepSep {
		return func(text string) []string {
			return splitTextKeepSeparator(text, sep)
		}
	}
	return func(text string) []string {
		return strings.Split(text, sep)
	}
}

func (c *Chunker) SplitText(text string, chunkSize int) ([]string, error) {
	if text == "" {
		return []string{}, nil
	}

	splits, err := c.split(text, chunkSize)
	if err != nil {
		return nil, err
	}

	chunks := c.merge(splits, chunkSize)

	return chunks, nil
}

func (c *Chunker) split(text string, chunkSize int) ([]string, error) {
	tokens, err := c.encoder.Encode(text)
	if err != nil {
		return nil, err
	}

	if len(tokens) <= chunkSize {
		return []string{text}, nil
	}

	var splits []string
	for _, splitFn := range c.splitFns {
		splits = splitFn(text)
		if len(splits) > 1 {
			break
		}
	}

	var newSplits []string
	for _, split := range splits {
		tokens, err := c.encoder.Encode(split)
		if err != nil {
			return nil, err
		}

		if len(tokens) <= chunkSize {
			newSplits = append(newSplits, split)
		} else {
			subSplits, err := c.split(split, chunkSize)
			if err != nil {
				return nil, err
			}
			newSplits = append(newSplits, subSplits...)
		}
	}

	return newSplits, nil
}

func (c *Chunker) merge(splits []string, chunkSize int) []string {
	var chunks []string
	var curChunk []string
	curLen := 0

	for _, split := range splits {
		tokens, err := c.encoder.Encode(split)
		if err != nil {
			log.Println("Error encoding split:", err)
			continue
		}

		splitLen := len(tokens)
		if splitLen > chunkSize {
			log.Printf("Got a split of size %d, larger than chunk size %d.", splitLen, chunkSize)
		}

		if curLen+splitLen > chunkSize {
			chunk := strings.Join(curChunk, "")
			chunks = append(chunks, strings.TrimSpace(chunk))
			curChunk = []string{}
			curLen = 0
		}

		curChunk = append(curChunk, split)
		curLen += splitLen
	}

	if len(curChunk) > 0 {
		chunk := strings.Join(curChunk, "")
		chunks = append(chunks, strings.TrimSpace(chunk))
	}

	return chunks
}
