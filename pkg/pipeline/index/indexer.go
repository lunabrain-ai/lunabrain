package index

import "github.com/google/uuid"

// TODO breadchris figure out how this works
type Indexer interface {
	NewIndex() (uuid.UUID, error)
	Index(indexID uuid.UUID) error
}
