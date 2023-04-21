package db

import (
	"github.com/glebarez/sqlite"
	"github.com/lunabrain-ai/lunabrain/pkg/store/cache"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"os"
)

func NewGormDB(cache cache.Cache) (*gorm.DB, error) {
	dbType := os.Getenv("DB_TYPE")
	dsn := os.Getenv("DB_DSN")

	var openedDb gorm.Dialector
	if dbType == "postgres" {
		openedDb = postgres.Open(dsn)
	} else {
		dbPath, err := cache.GetFile("db.sqlite")
		if err != nil {
			return nil, err
		}
		openedDb = sqlite.Open(dbPath + "?cache=shared&mode=rwc&_journal_mode=WAL")
	}

	db, err := gorm.Open(openedDb, &gorm.Config{
		Logger: Logger{},
	})
	if err != nil {
		return nil, err
	}
	return db, nil
}
