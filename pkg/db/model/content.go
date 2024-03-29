package model

import "github.com/google/uuid"

type Content struct {
	Base

	*ContentData
	UserID         uuid.UUID  `json:"user_id"`
	User           *User      `json:"user"`
	Root           bool       `json:"root"`
	VisitCount     int64      `json:"visit_count"`
	Tags           []*Tag     `gorm:"many2many:content_tags;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	RelatedContent []*Content `gorm:"many2many:related_content;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Votes          []*Vote    `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Groups         []*Group   `gorm:"many2many:group_content;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Bots           []*Bot     `gorm:"many2many:bot_content;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

type Vote struct {
	Base

	ContentID uuid.UUID `json:"content_id"`
	Content   *Content  `json:"content"`
	UserID    uuid.UUID `json:"user_id"`
	User      *User     `json:"user"`
}

type Tag struct {
	Base

	Name    string     `json:"name" gorm:"unique"`
	GroupID uuid.UUID  `json:"group_id"`
	Group   *Group     `json:"group"`
	Content []*Content `gorm:"many2many:content_tags;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	Domain  bool       `json:"domain"`
}
