package text

import (
	"context"
	"github.com/lunabrain-ai/lunabrain/gen/python"
	"github.com/google/wire"
	"github.com/pkg/errors"
	"os"
)

var ProviderSet = wire.NewSet(
	NewSummarizer,
	wire.Bind(new(Summarizer), new(*summarizer)),
)

type Summarizer interface {
	SummarizeFile(fileName string) (string, error)
	SummarizeText(text string) (string, error)
}

type summarizer struct {
	client python.PythonClient
}

func (s *summarizer) SummarizeFile(fileName string) (string, error) {
	content, err := os.ReadFile(fileName)
	if err != nil {
		return "", errors.Wrapf(err, "unable to read file %s", fileName)
	}
	return s.SummarizeText(string(content))
}

func (s *summarizer) SummarizeText(text string) (string, error) {
	resp, err := s.client.Summarize(context.Background(), &python.SummarizeRequest{
		Summarizer: python.Summarizer_BERT,
		Content:    text,
	})
	if err != nil {
		return "", errors.Wrapf(err, "unable to summarize text %s", text)
	}
	return resp.Summary, nil
}

func NewSummarizer(client python.PythonClient) (*summarizer, error) {
	return &summarizer{
		client: client,
	}, nil
}
