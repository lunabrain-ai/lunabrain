package model

type Bot struct {
	Base

	Name      string     `json:"name" gorm:"unique"`
	Content   []Content  `gorm:"many2many:bot_content;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	GroupBots []GroupBot `gorm:"foreignKey:BotID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}
