package transform

import (
	"context"
	"encoding/json"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/lunabrain-ai/lunabrain/gen/python"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/transform/content"
)

type Categorizer interface {
	CategorizeText(text string) (*content.Content, error)
	CategorizeTextWithCategorizer(text string, categorizer python.Categorizer) (*content.Content, error)
}

type Categorize struct {
	client python.PythonClient
}

func (s *Categorize) CategorizeTextWithCategorizer(text string, categorizer python.Categorizer) (*content.Content, error) {
	categories, err := s.client.Categorize(context.Background(), &python.CategorizeRequest{
		Text:        text,
		Categorizer: categorizer,
	})
	if err != nil {
		return nil, err
	}

	serCat, err := json.Marshal(categories.Categories)
	if err != nil {
		return nil, err
	}
	return &content.Content{
		TransformerID: genapi.TransformerID_CATEGORIES,
		Data:          string(serCat),
	}, nil
}

func (s *Categorize) CategorizeText(text string) (*content.Content, error) {
	return s.CategorizeTextWithCategorizer(text, python.Categorizer_T5_TAG)
}

func NewCategorize(client python.PythonClient) (*Categorize, error) {
	return &Categorize{
		client: client,
	}, nil
}
