package model

import "github.com/google/uuid"

type TransformedContent struct {
	Base

	TransformerID       int32             `json:"transformerID"`
	Data                string            `json:"data"`
	NormalizedContentID uuid.UUID         `gorm:"foreignKey:ID"`
	NormalizedContent   NormalizedContent `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}
