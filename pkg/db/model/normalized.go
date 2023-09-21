package model

import "github.com/google/uuid"

type NormalizedContent struct {
	Base

	NormalizerID       int32  `json:"normalizerID"`
	Data               string `json:"data"`
	ContentID          uuid.UUID
	Content            Content              `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	TransformedContent []TransformedContent `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}
