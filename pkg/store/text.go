package store

type TextStore struct {
}

func NewTextStore() (*TextStore, error) {
	return &TextStore{}, nil
}
