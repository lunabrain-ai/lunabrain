package db

import (
	"encoding/json"
	"github.com/alexferrari88/gohn/pkg/gohn"
	"github.com/google/uuid"
	"github.com/google/wire"
	genapi "github.com/lunabrain-ai/lunabrain/gen"
	normalcontent "github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize/content"
	transformcontent "github.com/lunabrain-ai/lunabrain/pkg/pipeline/transform/content"
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
		NewGormDB,
		New,
		NewSession,
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
	StoreDiscordMessages(msgs []*model.DiscordMessage) error
	StoreDiscordTranscript(chanID, startMsg, endMsg, transcript string) error
	GetDiscordMessages(chanID string) ([]*model.DiscordMessage, error)
	GetLatestDiscordTranscript() (*model.DiscordTranscript, error)
	GetLatestDiscordMessage() (*model.DiscordMessage, error)
	SaveHNStory(ID int, url string, position *int, contentID uuid.UUID, story *gohn.Item, comments gohn.ItemsIndex) (*model.HNStory, error)
	GetHNStory(ID int) (*model.HNStory, error)
	GetTopHNStories() ([]model.HNStory, error)
	AddContentToIndex(contentID uuid.UUID, indexID uuid.UUID) error
}

type dbStore struct {
	db *gorm.DB
}

var _ Store = (*dbStore)(nil)

func New(db *gorm.DB) (*dbStore, error) {
	// TODO breadchris migration should be done via a migration tool, no automigrate
	log.Info().Msg("migrating database")
	err := db.AutoMigrate(
		&model.Content{},
		&model.NormalizedContent{},
		&model.TransformedContent{},
		&model.LocatedContent{},
		&model.Index{},
		&model.DiscordChannel{},
		&model.DiscordMessage{},
		&model.DiscordTranscript{},
		&model.HNStory{},
	)
	if err != nil {
		return nil, errors.Wrapf(err, "could not migrate database: %v", err)
	}
	return &dbStore{db: db}, nil
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
		return nil, nil, errors.Wrapf(res.Error, "could not get content")
	}

	// TODO breadchris this seems like a problem with gorm and preloading associations
	for i, c := range content {
		for j, nc := range c.NormalizedContent {
			var transformedContent []model.TransformedContent
			res = s.db.Find(&transformedContent, "normalized_content_id = ?", nc.ID)
			if res.Error != nil {
				return nil, nil, errors.Wrapf(res.Error, "could not get transformed content")
			}
			content[i].NormalizedContent[j].TransformedContent = transformedContent
		}
	}
	return content, &pagination, nil
}

func (s *dbStore) GetContentByID(contentID uuid.UUID) (*model.Content, error) {
	var content model.Content
	res := s.db.Where("id = ?", contentID).Preload(clause.Associations).First(&content)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get content")
	}

	// TODO breadchris this seems like a problem with gorm and preloading associations
	for j, nc := range content.NormalizedContent {
		var transformedContent []model.TransformedContent
		res = s.db.Find(&transformedContent, "normalized_content_id = ?", nc.ID)
		if res.Error != nil {
			return nil, errors.Wrapf(res.Error, "could not get transformed content")
		}
		content.NormalizedContent[j].TransformedContent = transformedContent
	}
	return &content, nil
}

func (s *dbStore) SaveHNStory(ID int, url string, position *int, contentID uuid.UUID, story *gohn.Item, comments gohn.ItemsIndex) (*model.HNStory, error) {
	hnStory := &model.HNStory{
		ID:        ID,
		URL:       url,
		ContentID: contentID,
		Data: datatypes.JSONType[*gohn.Item]{
			Data: story,
		},
		Comments: datatypes.JSONType[gohn.ItemsIndex]{
			Data: comments,
		},
	}

	if position != nil {
		hnStory.Position = *position
	}

	var existingStory model.HNStory
	res := s.db.First(&existingStory, ID)
	if res.Error != nil {
		if !errors.Is(res.Error, gorm.ErrRecordNotFound) {
			return nil, errors.Wrapf(res.Error, "could not get hn story")
		}
		res = s.db.Create(hnStory)
		if res.Error != nil {
			return nil, errors.Wrapf(res.Error, "could not create hn story")
		}
		return hnStory, nil
	}

	if position != nil {
		res = s.db.Model(&model.HNStory{}).Where("position = ?", position).Update("position", nil)
		if res.Error != nil && !errors.Is(res.Error, gorm.ErrRecordNotFound) {
			return nil, errors.Wrapf(res.Error, "could not update hn story position")
		}
	}

	res = s.db.Model(&existingStory).Where(ID).Updates(hnStory)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not update hn story")
	}
	return hnStory, nil
}

func (s *dbStore) GetHNStory(ID int) (*model.HNStory, error) {
	var hnStory model.HNStory
	res := s.db.Where("id = ?", ID).First(&hnStory)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get hn story")
	}
	return &hnStory, nil
}

func (s *dbStore) GetTopHNStories() ([]model.HNStory, error) {
	var hnStories []model.HNStory
	res := s.db.Where("position IS NOT NULL").Order("position asc").Limit(30).Preload("Content").Preload("Content.NormalizedContent").Preload("Content.NormalizedContent.TransformedContent").Find(&hnStories)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get hn stories")
	}
	return hnStories, nil
}

func (s *dbStore) AddContentToIndex(contentID uuid.UUID, indexID uuid.UUID) error {
	res := s.db.Model(&model.Content{}).Where("id = ?", contentID).Update("index_id", indexID)
	if res.Error != nil {
		return errors.Wrapf(res.Error, "could not add content to index")
	}
	return nil
}

func (s *dbStore) GetDiscordMessages(chanID string) ([]*model.DiscordMessage, error) {
	var discordMessages []*model.DiscordMessage
	res := s.db.Where("discord_channel_id = ?", chanID).Order("created_at DESC").Find(&discordMessages)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get discord messages")
	}
	return discordMessages, nil
}

func (s *dbStore) GetLatestDiscordMessage() (*model.DiscordMessage, error) {
	var discordMessage model.DiscordMessage
	res := s.db.Model(&discordMessage).Order("created_at DESC").First(&discordMessage)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get latest discord message")
	}
	return &discordMessage, nil
}

func (s *dbStore) GetLatestDiscordTranscript() (*model.DiscordTranscript, error) {
	var discordTranscript model.DiscordTranscript
	res := s.db.Model(&discordTranscript).Order("created_at DESC").First(&discordTranscript)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get latest discord transcript")
	}
	return &discordTranscript, nil
}

func (s *dbStore) StoreDiscordTranscript(chanID, startMsg, endMsg, transcript string) error {
	res := s.db.Create(&model.DiscordTranscript{
		DiscordChannelID: chanID,
		Transcript:       transcript,
		StartMessageID:   startMsg,
		EndMessageID:     endMsg,
	})
	if res.Error != nil {
		return errors.Wrapf(res.Error, "could not save discord transcript")
	}
	return nil
}

func (s *dbStore) StoreDiscordMessages(msgs []*model.DiscordMessage) error {
	for _, msg := range msgs {
		res := s.db.Create(msg)
		if res.Error != nil {
			//return errors.Wrapf(res.Error, "could not save discord message: %v", msg.ID)
			log.Warn().Str("msg_id", msg.MessageID).Err(res.Error).Msg("could not save discord message")
			continue
		}
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

func (s *dbStore) SaveContent(contentType genapi.ContentType, data string, metadata json.RawMessage) (uuid.UUID, error) {
	content := model.Content{
		Type:     int32(contentType),
		Data:     data,
		Metadata: datatypes.JSON(metadata),
	}
	res := s.db.Create(&content)

	if res.Error != nil {
		return uuid.UUID{}, errors.Wrapf(res.Error, "could not save content")
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
			return nil, errors.Wrapf(res.Error, "could not save normalContent")
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
			return nil, errors.Wrapf(res.Error, "could not save transformedContent")
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
		return uuid.UUID{}, errors.Wrapf(res.Error, "could not save locContent")
	}
	return locContent.ID, nil
}
