package model

type Index struct {
	Base

	Name    string
	Content []Content `gorm:"constraint:OnUpdate:CASCADE,OnDelete:CASCADE"`
}
