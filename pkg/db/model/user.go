package model

import (
	"github.com/lunabrain-ai/lunabrain/gen/user"
	"gorm.io/datatypes"
)

type User struct {
	Base

	PasswordHash string
	Data         datatypes.JSONType[*user.User]
	Content      []Content   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	GroupUsers   []GroupUser `gorm:"foreignKey:UserID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Sessions     []Session   `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}
