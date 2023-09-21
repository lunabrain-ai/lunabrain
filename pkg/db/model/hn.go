package model

import (
	"github.com/alexferrari88/gohn/pkg/gohn"
	"github.com/google/uuid"
	"gorm.io/datatypes"
)

type HNStory struct {
	BaseWithoutID

	ID        int `gorm:"primary_key;"`
	URL       string
	Position  int
	ContentID uuid.UUID
	Content   Content `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Data      datatypes.JSONType[*gohn.Item]
	Comments  datatypes.JSONType[gohn.ItemsIndex]
}
