package db

import (
	"encoding/json"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/lunabrain-ai/lunabrain/pkg/model"
	"github.com/lunabrain-ai/lunabrain/pkg/store"
	"github.com/google/uuid"
	"github.com/google/wire"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

var (
	ProviderSet = wire.NewSet(
		NewConfig,
		NewDB,
		wire.Bind(new(Store), new(*dbStore)),
	)
)

type Store interface {
	SaveContent(contentType genapi.ContentType, data string, metadata json.RawMessage) (uuid.UUID, error)
	SaveNormalizedContent(contentID uuid.UUID, data string) (uuid.UUID, error)
	SaveLocatedContent(contentID uuid.UUID, data string) (uuid.UUID, error)
	GetStoredContent() ([]model.Content, error)
}

type dbStore struct {
	db *gorm.DB
}

func NewDB(cache *store.FolderCache) (*dbStore, error) {
	db, err := connect(cache)
	if err != nil {
		return nil, errors.Wrapf(err, "could not connect to database: %v", err)
	}

	// TODO breadchris migration should be done via a migration tool, no automigrate
	log.Info().Msg("migrating database")
	err = db.AutoMigrate(&model.Content{}, &model.NormalizedContent{}, &model.LocatedContent{})
	if err != nil {
		return nil, errors.Wrapf(err, "could not migrate database: %v", err)
	}
	return &dbStore{db: db}, nil
}

func (s *dbStore) GetStoredContent() ([]model.Content, error) {
	var content []model.Content
	res := s.db.Model(&model.Content{}).Preload("NormalizedContent").Find(&content)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get content: %v", res.Error)
	}
	return content, nil
}

func (s *dbStore) SaveContent(contentType genapi.ContentType, data string, metadata json.RawMessage) (uuid.UUID, error) {
	content := model.Content{
		Type:     int32(contentType),
		Data:     data,
		Metadata: datatypes.JSON(metadata),
	}
	res := s.db.Create(&content)

	if res.Error != nil {
		return uuid.UUID{}, errors.Wrapf(res.Error, "could not save content: %v", res.Error)
	}
	return content.ID, nil
}

func (s *dbStore) SaveNormalizedContent(contentID uuid.UUID, data string) (uuid.UUID, error) {
	normalContent := model.NormalizedContent{
		Data:      data,
		ContentID: contentID,
	}
	res := s.db.Create(&normalContent)

	if res.Error != nil {
		return uuid.UUID{}, errors.Wrapf(res.Error, "could not save normalContent: %v", res.Error)
	}
	return normalContent.ID, nil
}

func (s *dbStore) SaveLocatedContent(contentID uuid.UUID, data string) (uuid.UUID, error) {
	normalContent := model.LocatedContent{
		Data:      &data,
		ContentID: contentID,
	}
	res := s.db.Create(&normalContent)

	if res.Error != nil {
		return uuid.UUID{}, errors.Wrapf(res.Error, "could not save normalContent: %v", res.Error)
	}
	return normalContent.ID, nil
}
