package index

import (
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
)

// TODO breadchris figure out how this works
type Indexer interface {
	NewIndex() (uuid.UUID, error)
	Insert(indexID uuid.UUID, normalContentIDs []uuid.UUID) ([]uuid.UUID, error)
	Delete(indexID uuid.UUID, normalContentIDs []uuid.UUID) error
	Update(indexID uuid.UUID, normalContentIDs []uuid.UUID) error
}

type Index struct {
	db *db.Store
}

func (i *Index) NewIndex() (uuid.UUID, error) {
	return uuid.New(), nil
}

func NewIndex(db *db.Store) *Index {
	return &Index{
		db: db,
	}
}
