package model

import "gorm.io/gorm"

type ProcessedReference struct {
	Base

	URL                 string `json:"url" gorm:"uniqueIndex"`
	Title               string `json:"title"`
	Content             string `json:"content"`
	NormalizedContent   string `json:"normalized_content"`
	ContentType         string `json:"content_type"`
	SuccessfulFetch     bool   `json:"successful_fetch"`
	ReferenceEmbeddings []ReferenceEmbedding
}

type ReferenceEmbedding struct {
	gorm.Model

	ProcessedReferenceID uint
	ProcessedReference   ProcessedReference
	ContentHash          string `json:"content_hash" gorm:"uniqueIndex"`
	Embedding            string `json:"embedding"`
}
