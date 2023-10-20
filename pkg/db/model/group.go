package model

import (
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/gen/user"
	"gorm.io/datatypes"
)

type Group struct {
	Base

	Data       datatypes.JSONType[*user.Group]
	GroupUsers []GroupUser   `gorm:"foreignKey:GroupID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	GroupBots  []GroupBot    `gorm:"foreignKey:GroupID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Invites    []GroupInvite `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Content    []Content     `gorm:"many2many:group_content;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

type GroupUser struct {
	Base

	UserID  uuid.UUID
	GroupID uuid.UUID
	User    User  `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Group   Group `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Role    string
}

type GroupBot struct {
	Base

	BotID   uuid.UUID
	GroupID uuid.UUID
	Bot     Bot   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Group   Group `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
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
