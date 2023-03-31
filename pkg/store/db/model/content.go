package model

import (
	"github.com/google/uuid"
	"gorm.io/datatypes"
)

type Content struct {
	Base

	Type              int32 `json:"type"`
	Metadata          datatypes.JSON
	Data              string              `json:"data"`
	NormalizedContent []NormalizedContent `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	LocatedContent    []LocatedContent    `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	IndexID           *uuid.UUID          `json:"index_id"`
	Index             *Index              `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

// LocatedContent is for content that must be located in a specific place, such as a URL. For larger content, data will be set to a location in a bucket.
type LocatedContent struct {
	Base

	Data       *string `json:"data"`
	BucketData *string `json:"bucket_data"`
	ContentID  uuid.UUID
	Content    Content `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}
