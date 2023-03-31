package text

import (
	"context"
	"github.com/google/wire"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/lunabrain-ai/lunabrain/gen/python"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize/types"
	"github.com/pkg/errors"
	"os"
)

var ProviderSet = wire.NewSet(
	NewSummarizer,
	wire.Bind(new(Summarizer), new(*summarizer)),
)

type Summarizer interface {
	SummarizeFile(fileName string) (*types.Content, error)
	SummarizeText(text string) (*types.Content, error)
	SummarizeTextWithSummarizer(text string, summarizer python.Summarizer) (*types.Content, error)
}

type summarizer struct {
	client python.PythonClient
}

func (s *summarizer) SummarizeFile(fileName string) (*types.Content, error) {
	content, err := os.ReadFile(fileName)
	if err != nil {
		return nil, errors.Wrapf(err, "unable to read file %s", fileName)
	}
	return s.SummarizeText(string(content))
}

func (s *summarizer) SummarizeText(text string) (*types.Content, error) {
	return s.SummarizeTextWithSummarizer(text, python.Summarizer_BERT)
}

func (s *summarizer) SummarizeTextWithSummarizer(text string, summarizer python.Summarizer) (*types.Content, error) {
	resp, err := s.client.Summarize(context.Background(), &python.SummarizeRequest{
		Summarizer: summarizer,
		Content:    text,
	})
	if err != nil {
		return nil, errors.Wrapf(err, "unable to summarize text %s", text)
	}
	return &types.Content{
		NormalizerID: genapi.NormalizerID_TEXT_SUMMARY,
		Data:         resp.Summary,
	}, nil
}

func NewSummarizer(client python.PythonClient) (*summarizer, error) {
	return &summarizer{
		client: client,
	}, nil
}
