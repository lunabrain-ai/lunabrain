package transform

import (
	"context"
	"encoding/json"
	"github.com/lunabrain-ai/lunabrain/gen"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/transform/content"
)

type Categorizer interface {
	CategorizeText(text string) (*content.Content, error)
	CategorizeTextWithCategorizer(text string, categorizer gen.Categorizer) (*content.Content, error)
}

type Categorize struct {
	client gen.PythonClient
}

func (s *Categorize) CategorizeTextWithCategorizer(text string, categorizer gen.Categorizer) (*content.Content, error) {
	categories, err := s.client.Categorize(context.Background(), &gen.CategorizeRequest{
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
		TransformerID: gen.TransformerID_CATEGORIES,
		Data:          string(serCat),
	}, nil
}

func (s *Categorize) CategorizeText(text string) (*content.Content, error) {
	return s.CategorizeTextWithCategorizer(text, gen.Categorizer_T5_TAG)
}

func NewCategorize(client gen.PythonClient) (*Categorize, error) {
	return &Categorize{
		client: client,
	}, nil
}
