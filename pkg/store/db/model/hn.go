package model

import "github.com/google/uuid"

type HNStory struct {
	BaseWithoutID

	ID        int `gorm:"type:uuid;primary_key;"`
	URL       string
	ContentID uuid.UUID
	Content   Content `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}
