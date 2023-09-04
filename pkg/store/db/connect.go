package db

import (
	"github.com/lunabrain-ai/lunabrain/pkg/store/bucket"
	"github.com/pkg/errors"
	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func NewGormDB(config Config, bucket *bucket.Bucket) (*gorm.DB, error) {
	var openedDb gorm.Dialector
	if config.Type == "postgres" {
		openedDb = postgres.Open(config.DSN)
	} else {
		dbPath, err := bucket.NewFile(config.DSN)
		if err != nil {
			return nil, errors.Wrapf(err, "failed to create db file")
		}
		openedDb = sqlite.Open(dbPath + "?bucket=shared&mode=rwc&_journal_mode=WAL")
	}

	db, err := gorm.Open(openedDb, &gorm.Config{
		Logger: Logger{},
	})
	if err != nil {
		return nil, errors.Wrapf(err, "failed to open db")
	}
	return db, nil
}
