package model

import (
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/gen"
	"gorm.io/datatypes"
)

type Session struct {
	Base

	UserID uuid.UUID
	User   User `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`

	Segments []Segment

	// TODO breadchris Data should probably be Raw, Doc, Proto?
	Data datatypes.JSONType[*gen.Session]
}

type Segment struct {
	Base

	SessionID uuid.UUID
	Session   Session `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Data      datatypes.JSONType[*gen.Segment]
}

type Prompt struct {
	Base

	Data datatypes.JSONType[*gen.Prompt]
}
