package model

import (
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/gen"
	"github.com/lunabrain-ai/lunabrain/gen/user"
	"gorm.io/datatypes"
)

type Session struct {
	Base

	UserID uuid.UUID `gorm:"foreignKey:ID"`
	User   User      `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`

	Segments []Segment

	// TODO breadchris Data should probably be Raw, Doc, Proto?
	Data datatypes.JSONType[*gen.Session]
}

type Segment struct {
	Base

	SessionID uuid.UUID `gorm:"foreignKey:ID"`
	Session   Session   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Data      datatypes.JSONType[*gen.Segment]
}

type Prompt struct {
	Base

	Data datatypes.JSONType[*gen.Prompt]
}

type User struct {
	Base

	Data            datatypes.JSONType[*user.User]
	Content         []Content `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Groups          []Group   `gorm:"many2many:group_users;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	ModeratorGroups []Group   `gorm:"many2many:group_moderators;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

type Group struct {
	Base

	Data       datatypes.JSONType[*user.Group]
	Users      []User        `gorm:"many2many:group_users;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Moderators []User        `gorm:"many2many:group_moderators;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Invites    []GroupInvite `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

type GroupInvite struct {
	Base

	GroupID uuid.UUID `gorm:"foreignKey:ID"`
	Group   Group     `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`

	// TODO breadchris add user restriction to invite?
	// TODO breadchris add group restriction to invite?
	// I want this to feel like a circles of trust thing

	Secret string
}
