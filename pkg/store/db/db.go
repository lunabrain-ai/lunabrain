package db

import (
	"encoding/json"
	"github.com/bwmarrin/discordgo"
	"github.com/google/uuid"
	"github.com/google/wire"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/lunabrain-ai/lunabrain/pkg/chat/discord/util"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize/types"
	"github.com/lunabrain-ai/lunabrain/pkg/store"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db/model"
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
	SaveNormalizedContent(contentID uuid.UUID, normalContent []*types.Content) ([]uuid.UUID, error)
	SaveLocatedContent(contentID uuid.UUID, data string) (uuid.UUID, error)
	GetStoredContent(page, limit int) ([]model.Content, *Pagination, error)
	StoreDiscordMessages(msgs []*discordgo.Message) error
	StoreHNStory(ID int, url string, contentID uuid.UUID) (*model.HNStory, error)
	GetLatestDiscordTranscript() (*model.DiscordTranscript, error)
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
	err = db.AutoMigrate(
		&model.Content{},
		&model.NormalizedContent{},
		&model.LocatedContent{},
		&model.Index{},
		&model.DiscordTranscript{},
		&model.HNStory{},
	)
	if err != nil {
		return nil, errors.Wrapf(err, "could not migrate database: %v", err)
	}
	return &dbStore{db: db}, nil
}

func (s *dbStore) StoreHNStory(ID int, url string, contentID uuid.UUID) (*model.HNStory, error) {
	var hnStory model.HNStory

	res := s.db.Create(&model.HNStory{
		ID:        ID,
		URL:       url,
		ContentID: contentID,
	})
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not save hn story: %v", res.Error)
	}
	return &hnStory, nil
}

func (s *dbStore) GetLatestDiscordTranscript() (*model.DiscordTranscript, error) {
	var discordTranscript model.DiscordTranscript
	res := s.db.Model(&discordTranscript).Order("created_at DESC").First(&discordTranscript)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get latest discord message: %v", res.Error)
	}
	return &discordTranscript, nil
}

func (s *dbStore) StoreDiscordMessages(msgs []*discordgo.Message) error {
	startMessage := msgs[0]
	endMessage := msgs[len(msgs)-1]

	res := s.db.Create(&model.DiscordTranscript{
		DiscordChannelID: startMessage.ChannelID,
		Transcript:       util.GenerateTranscript(msgs),
		StartMessageID:   startMessage.ID,
		EndMessageID:     endMessage.ID,
	})
	if res.Error != nil {
		return errors.Wrapf(res.Error, "could not save discord transcript: %v", res.Error)
	}
	return nil
}

func (s *dbStore) GetStoredContent(page, limit int) ([]model.Content, *Pagination, error) {
	var content []model.Content
	pagination := Pagination{
		Limit: limit,
		Page:  page,
	}
	res := s.db.Order("created_at desc").Scopes(paginate(content, &pagination, s.db)).Preload("NormalizedContent").Find(&content)
	if res.Error != nil {
		return nil, nil, errors.Wrapf(res.Error, "could not get content: %v", res.Error)
	}
	return content, &pagination, nil
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

func (s *dbStore) SaveNormalizedContent(contentID uuid.UUID, normalContent []*types.Content) ([]uuid.UUID, error) {
	var normalContentIDs []uuid.UUID
	for _, c := range normalContent {
		locatedContent := model.NormalizedContent{
			Data:         c.Data,
			NormalizerID: int32(c.NormalizerID),
			ContentID:    contentID,
		}

		res := s.db.Create(&locatedContent)
		if res.Error != nil {
			return nil, errors.Wrapf(res.Error, "could not save normalContent: %v", res.Error)
		}
		normalContentIDs = append(normalContentIDs, locatedContent.ID)
	}
	return normalContentIDs, nil
}

func (s *dbStore) SaveLocatedContent(contentID uuid.UUID, data string) (uuid.UUID, error) {
	locContent := model.LocatedContent{
		Data:      &data,
		ContentID: contentID,
	}
	res := s.db.Create(&locContent)
	if res.Error != nil {
		return uuid.UUID{}, errors.Wrapf(res.Error, "could not save locContent: %v", res.Error)
	}
	return locContent.ID, nil
}
