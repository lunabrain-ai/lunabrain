package scrape

import (
	"github.com/glebarez/sqlite"
	golog "log"
	"os"
	"time"

	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type ProcessedReference struct {
	gorm.Model

	VulnerabilityID     string `json:"id"`
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

func loadGormDB(cache string) (*gorm.DB, error) {
	newLogger := logger.New(
		golog.New(os.Stdout, "\r\n", golog.LstdFlags),
		logger.Config{
			SlowThreshold: time.Second,
			LogLevel:      logger.Silent,
			Colorful:      false,
		},
	)
	db, err := gorm.Open(sqlite.Open(cache+"?cache=shared&mode=rwc"), &gorm.Config{
		Logger: newLogger,
	})
	if err != nil {
		return nil, err
	}

	err = db.AutoMigrate(&ProcessedReference{})
	if err != nil {
		return nil, err
	}

	err = db.AutoMigrate(&ReferenceEmbedding{})
	if err != nil {
		return nil, err
	}
	return db, nil
}
