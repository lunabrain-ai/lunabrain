package index

import (
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db/model"
)

// TODO breadchris figure out how this works
type Indexer interface {
	NewIndex() (uuid.UUID, error)
	Index(indexID uuid.UUID, normalContent []*model.NormalizedContent) error
}
