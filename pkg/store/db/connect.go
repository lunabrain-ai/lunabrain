package db

import (
	"github.com/lunabrain-ai/lunabrain/pkg/store"
	"github.com/glebarez/sqlite"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"os"
)

func connect(cache *store.FolderCache) (*gorm.DB, error) {
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
		openedDb = sqlite.Open(dbPath + "?cache=shared&mode=rwc")
	}

	db, err := gorm.Open(openedDb, &gorm.Config{})
	if err != nil {
		return nil, err
	}
	return db, nil
}
