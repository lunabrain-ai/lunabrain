package transform

import (
	"context"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/lunabrain-ai/lunabrain/gen/python"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/transform/content"
	"github.com/pkg/errors"
	"os"
)

type Summarizer interface {
	SummarizeFile(fileName string) (*content.Content, error)
	SummarizeText(text string) (*content.Content, error)
	SummarizeTextWithSummarizer(text string, summarizer python.Summarizer) (*content.Content, error)
}

type Summarize struct {
	client python.PythonClient
}

func (s *Summarize) SummarizeFile(fileName string) (*content.Content, error) {
	content, err := os.ReadFile(fileName)
	if err != nil {
		return nil, errors.Wrapf(err, "unable to read file %s", fileName)
	}
	return s.SummarizeText(string(content))
}

func (s *Summarize) SummarizeText(text string) (*content.Content, error) {
	return s.SummarizeTextWithSummarizer(text, python.Summarizer_BERT)
}

func (s *Summarize) SummarizeTextWithSummarizer(text string, summarizer python.Summarizer) (*content.Content, error) {
	resp, err := s.client.Summarize(context.Background(), &python.SummarizeRequest{
		Summarizer: summarizer,
		Content:    text,
	})
	if err != nil {
		return nil, errors.Wrapf(err, "unable to summarize text %s", text)
	}

	return &content.Content{
		TransformerID: genapi.TransformerID_SUMMARY,
		Data:          resp.Summary,
	}, nil
}

func NewSummarize(client python.PythonClient) (*Summarize, error) {
	return &Summarize{
		client: client,
	}, nil
}
