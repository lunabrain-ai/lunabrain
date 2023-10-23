package content

import "github.com/lunabrain-ai/lunabrain/gen/content"

type Store struct {
}

func NewStore() *Store {
	return &Store{}
}

func (s *Store) Save(content *content.Content) error {
	return nil
}
