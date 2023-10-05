package model

type Content struct {
	Base

	*ContentData
	VisitCount     int64     `json:"visit_count"`
	Tag            []Tag     `gorm:"many2many:content_tags;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
	RelatedContent []Content `gorm:"many2many:related_content;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}

type Tag struct {
	Base

	Tag     string    `json:"tag"`
	Content []Content `gorm:"many2many:content_tags;constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}
