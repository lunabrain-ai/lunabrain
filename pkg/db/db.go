package db

import (
	"github.com/alexferrari88/gohn/pkg/gohn"
	"github.com/google/uuid"
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/gen/content"
	"github.com/lunabrain-ai/lunabrain/pkg/db/model"
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
	)
)

type Store struct {
	db *gorm.DB
}

func New(db *gorm.DB) (*Store, error) {
	// TODO breadchris migration should be done via a migration tool, no automigrate
	log.Info().Msg("migrating database")
	err := db.AutoMigrate(
		&model.Content{},
		&model.DiscordChannel{},
		&model.DiscordMessage{},
		&model.DiscordTranscript{},
		&model.HNStory{},
	)
	if err != nil {
		return nil, errors.Wrapf(err, "could not migrate database: %v", err)
	}
	return &Store{db: db}, nil
}

func (s *Store) GetAllContent(page, limit int) ([]model.Content, *Pagination, error) {
	var c []model.Content
	pagination := Pagination{
		Limit: limit,
		Page:  page,
	}
	res := s.db.Order("created_at desc").
		Scopes(paginate(c, &pagination, s.db)).
		Preload(clause.Associations).
		Find(&c)
	if res.Error != nil {
		return nil, nil, errors.Wrapf(res.Error, "could not get content")
	}
	return c, &pagination, nil
}

func (s *Store) GetContentByID(contentID uuid.UUID) (*model.Content, error) {
	var content model.Content
	res := s.db.Where("id = ?", contentID).Preload(clause.Associations).First(&content)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get content")
	}
	return &content, nil
}

func (s *Store) SaveHNStory(ID int, url string, position *int, contentID uuid.UUID, story *gohn.Item, comments gohn.ItemsIndex) (*model.HNStory, error) {
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
			log.Warn().Str("msg_id", msg.MessageID).Err(res.Error).Msg("could not save discord message")
			continue
		}
	}
	return nil
}

func (s *Store) DeleteContent(id string) error {
	res := s.db.Delete(&model.Content{}, "id = ?", id)
	if res.Error != nil {
		return errors.Wrapf(res.Error, "could not delete content")
	}
	return nil
}

func (s *Store) SaveContent(data *content.Content) (uuid.UUID, error) {
	var (
		c     model.Content
		found bool
	)
	switch t := data.Type.(type) {
	case *content.Content_Data:
		switch u := t.Data.Type.(type) {
		case *content.Data_Url:
			if r := s.db.First(&c, datatypes.JSONQuery("content_data").Equals(u.Url.Url, "data", "url", "url")); r.Error != nil {
				if !errors.Is(r.Error, gorm.ErrRecordNotFound) {
					return uuid.UUID{}, errors.Wrapf(r.Error, "could not get content")
				}
			} else {
				found = true
			}
		}
	}
	var res *gorm.DB
	if !found {
		c = model.Content{
			ContentData: &model.ContentData{
				Data: data,
			},
			VisitCount: 1,
		}
		res = s.db.Create(&c)
	} else {
		res = s.db.Model(&c).Update("visit_count", gorm.Expr("visit_count + ?", 1))
	}
	if res.Error != nil {
		return uuid.UUID{}, errors.Wrapf(res.Error, "could not save content")
	}
	return c.ID, nil
}
