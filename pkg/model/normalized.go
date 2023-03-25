package model

import "github.com/google/uuid"

type NormalizedContent struct {
	Base

	Data      string `json:"data"`
	ContentID uuid.UUID
	Content   Content `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}
