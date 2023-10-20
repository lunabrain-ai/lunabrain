package db

import (
	"github.com/alexferrari88/gohn/pkg/gohn"
	"github.com/google/uuid"
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/pkg/db/model"
	"github.com/pkg/errors"
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"log/slog"
)

var (
	ProviderSet = wire.NewSet(
		NewConfig,
		NewGormDB,
		New,
		NewSession,
	)
)

type Store struct {
	db *gorm.DB
}

func New(db *gorm.DB) (*Store, error) {
	// TODO breadchris migration should be done via a migration tool, no automigrate
	slog.Info("migrating database")
	err := db.AutoMigrate(
		&model.Content{},
		&model.DiscordChannel{},
		&model.DiscordMessage{},
		&model.DiscordTranscript{},
		&model.HNStory{},
		&model.GroupUser{},
		&model.GroupInvite{},
		&model.User{},
		&model.Group{},
		&model.Vote{},
		&model.Tag{},
		&model.GroupBot{},
		&model.Bot{},
	)
	if err != nil {
		return nil, errors.Wrapf(err, "could not migrate database: %v", err)
	}
	return &Store{db: db}, nil
}

func (s *Store) SaveHNStory(ID int, url string, position *int, contentID uuid.UUID, story *gohn.Item, comments gohn.ItemsIndex) (*model.HNStory, bool, error) {
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
			return nil, false, errors.Wrapf(res.Error, "could not get hn story")
		}
		res = s.db.Create(hnStory)
		if res.Error != nil {
			return nil, false, errors.Wrapf(res.Error, "could not create hn story")
		}
		return hnStory, true, nil
	}

	if position != nil {
		res = s.db.Model(&model.HNStory{}).Where("position = ?", position).Update("position", nil)
		if res.Error != nil && !errors.Is(res.Error, gorm.ErrRecordNotFound) {
			return nil, false, errors.Wrapf(res.Error, "could not update hn story position")
		}
	}

	res = s.db.Model(&existingStory).Where(ID).Updates(hnStory)
	if res.Error != nil {
		return nil, false, errors.Wrapf(res.Error, "could not update hn story")
	}
	return hnStory, false, nil
}

func (s *Store) GetHNStory(ID int) (*model.HNStory, error) {
	var hnStory model.HNStory
	res := s.db.Where("id = ?", ID).First(&hnStory)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get hn story")
	}
	return &hnStory, nil
}

func (s *Store) GetTopHNStories() ([]model.HNStory, error) {
	var hnStories []model.HNStory
	res := s.db.Where("position IS NOT NULL").Order("position asc").Limit(30).Preload("Content").Preload("Content.NormalizedContent").Preload("Content.NormalizedContent.TransformedContent").Find(&hnStories)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get hn stories")
	}
	return hnStories, nil
}

func (s *Store) AddContentToIndex(contentID uuid.UUID, indexID uuid.UUID) error {
	res := s.db.Model(&model.Content{}).Where("id = ?", contentID).Update("index_id", indexID)
	if res.Error != nil {
		return errors.Wrapf(res.Error, "could not add content to index")
	}
	return nil
}

func (s *Store) GetDiscordMessages(chanID string) ([]*model.DiscordMessage, error) {
	var discordMessages []*model.DiscordMessage
	res := s.db.Where("discord_channel_id = ?", chanID).Order("created_at DESC").Find(&discordMessages)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get discord messages")
	}
	return discordMessages, nil
}

func (s *Store) GetLatestDiscordMessage() (*model.DiscordMessage, error) {
	var discordMessage model.DiscordMessage
	res := s.db.Model(&discordMessage).Order("created_at DESC").First(&discordMessage)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get latest discord message")
	}
	return &discordMessage, nil
}

func (s *Store) GetLatestDiscordTranscript() (*model.DiscordTranscript, error) {
	var discordTranscript model.DiscordTranscript
	res := s.db.Model(&discordTranscript).Order("created_at DESC").First(&discordTranscript)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get latest discord transcript")
	}
	return &discordTranscript, nil
}

func (s *Store) StoreDiscordTranscript(chanID, startMsg, endMsg, transcript string) error {
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

func (s *Store) StoreDiscordMessages(msgs []*model.DiscordMessage) error {
	for _, msg := range msgs {
		res := s.db.Create(msg)
		if res.Error != nil {
			//return errors.Wrapf(res.Error, "could not save discord message: %v", msg.ID)
			slog.Warn("could not save discord message", "error", res.Error, "msg_id", msg.MessageID)
			continue
		}
	}
	return nil
}
