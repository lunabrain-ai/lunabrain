package db

import (
	"encoding/json"
	"github.com/bwmarrin/discordgo"
	"github.com/google/uuid"
	"github.com/google/wire"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/lunabrain-ai/lunabrain/pkg/chat/discord/util"
	normalcontent "github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize/content"
	transformcontent "github.com/lunabrain-ai/lunabrain/pkg/pipeline/transform/content"
	"github.com/lunabrain-ai/lunabrain/pkg/store"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db/model"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
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
	SaveNormalizedContent(contentID uuid.UUID, normalContent []*normalcontent.Content) ([]uuid.UUID, error)
	SaveTransformedContent(normalContentID uuid.UUID, transformedContent []*transformcontent.Content) ([]uuid.UUID, error)
	SaveLocatedContent(contentID uuid.UUID, data string) (uuid.UUID, error)
	GetAllContent(page, limit int) ([]model.Content, *Pagination, error)
	GetContentByID(contentID uuid.UUID) (*model.Content, error)
	GetNormalContentByData(data string) ([]model.NormalizedContent, error)
	StoreDiscordMessages(msgs []*discordgo.Message) error
	StoreHNStory(ID int, url string, contentID uuid.UUID) (*model.HNStory, error)
	GetHNStory(ID int) (*model.HNStory, error)
	GetLatestDiscordTranscript() (*model.DiscordTranscript, error)
	AddContentToIndex(contentID uuid.UUID, indexID uuid.UUID) error
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
		&model.TransformedContent{},
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

func (s *dbStore) GetContentByID(contentID uuid.UUID) (*model.Content, error) {
	var content model.Content
	res := s.db.Where("id = ?", contentID).Preload(clause.Associations).First(&content)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get content: %v", res.Error)
	}
	return &content, nil
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

func (s *dbStore) GetHNStory(ID int) (*model.HNStory, error) {
	var hnStory model.HNStory
	res := s.db.Where("id = ?", ID).First(&hnStory)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get hn story: %v", res.Error)
	}
	return &hnStory, nil
}

func (s *dbStore) AddContentToIndex(contentID uuid.UUID, indexID uuid.UUID) error {
	res := s.db.Model(&model.Content{}).Where("id = ?", contentID).Update("index_id", indexID)
	if res.Error != nil {
		return errors.Wrapf(res.Error, "could not add content to index: %v", res.Error)
	}
	return nil
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

func (s *dbStore) GetNormalContentByData(data string) ([]model.NormalizedContent, error) {
	var content model.Content
	resp := s.db.Where("data = ?", data).Preload(clause.Associations).Find(&content)
	if resp.Error != nil {
		return nil, errors.Wrapf(resp.Error, "could not get content: %v", resp.Error)
	}
	return content.NormalizedContent, nil
}

func (s *dbStore) GetAllContent(page, limit int) ([]model.Content, *Pagination, error) {
	var content []model.Content
	pagination := Pagination{
		Limit: limit,
		Page:  page,
	}
	res := s.db.Order("created_at desc").
		Scopes(paginate(content, &pagination, s.db)).
		Preload(clause.Associations).
		Find(&content)
	if res.Error != nil {
		return nil, nil, errors.Wrapf(res.Error, "could not get content: %v", res.Error)
	}

	// TODO breadchris this seems like a problem with gorm and preloading associations
	for i, c := range content {
		for j, nc := range c.NormalizedContent {
			var transformedContent []model.TransformedContent
			res = s.db.Find(&transformedContent, "normalized_content_id = ?", nc.ID)
			if res.Error != nil {
				return nil, nil, errors.Wrapf(res.Error, "could not get transformed content: %v", res.Error)
			}
			content[i].NormalizedContent[j].TransformedContent = transformedContent
		}
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

func (s *dbStore) SaveNormalizedContent(contentID uuid.UUID, normalContent []*normalcontent.Content) ([]uuid.UUID, error) {
	var normalContentIDs []uuid.UUID
	for _, c := range normalContent {
		nc := model.NormalizedContent{
			Data:         c.Data,
			NormalizerID: int32(c.NormalizerID),
			ContentID:    contentID,
		}

		res := s.db.Create(&nc)
		if res.Error != nil {
			return nil, errors.Wrapf(res.Error, "could not save normalContent: %v", res.Error)
		}
		normalContentIDs = append(normalContentIDs, nc.ID)
	}
	return normalContentIDs, nil
}

func (s *dbStore) SaveTransformedContent(normalContentID uuid.UUID, transformedContent []*transformcontent.Content) ([]uuid.UUID, error) {
	var transformedContentIDs []uuid.UUID
	for _, c := range transformedContent {
		tc := model.TransformedContent{
			Data:                c.Data,
			TransformerID:       int32(c.TransformerID),
			NormalizedContentID: normalContentID,
		}

		res := s.db.Create(&tc)
		if res.Error != nil {
			return nil, errors.Wrapf(res.Error, "could not save transformedContent: %v", res.Error)
		}
		transformedContentIDs = append(transformedContentIDs, tc.ID)
	}
	return transformedContentIDs, nil
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
