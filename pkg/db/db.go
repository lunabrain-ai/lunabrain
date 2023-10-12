package db

import (
	"github.com/alexferrari88/gohn/pkg/gohn"
	"github.com/google/uuid"
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/gen/content"
	"github.com/lunabrain-ai/lunabrain/gen/user"
	"github.com/lunabrain-ai/lunabrain/pkg/db/model"
	"github.com/pkg/errors"
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
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
	)
	if err != nil {
		return nil, errors.Wrapf(err, "could not migrate database: %v", err)
	}
	return &Store{db: db}, nil
}

func (s *Store) GetTags() ([]string, error) {
	var tags []model.Tag
	res := s.db.Find(&tags)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get tags")
	}
	var tagNames []string
	for _, tag := range tags {
		tagNames = append(tagNames, tag.Name)
	}
	return tagNames, nil
}

func (s *Store) GetTagsForGroup(groupID uuid.UUID) ([]string, error) {
	group := &model.Group{
		Base: model.Base{
			ID: groupID,
		},
	}
	res := s.db.Preload("Content.Tags").Find(group)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get tags")
	}
	var tagNames []string
	for _, c := range group.Content {
		for _, tag := range c.Tags {
			tagNames = append(tagNames, tag.Name)
		}
	}
	return tagNames, nil
}

func (s *Store) GetGroupContent(groupID string) ([]model.Content, error) {
	g := &model.Group{
		Base: model.Base{
			ID: uuid.MustParse(groupID),
		},
	}
	res := s.db.Preload("Content").Preload("Content.RelatedContent").First(g)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get content")
	}
	return g.Content, nil
}

func (s *Store) GetAllContent(page, limit int) ([]model.Content, *Pagination, error) {
	// TODO breadchris only get content for user
	var c []model.Content
	pagination := Pagination{
		Limit: limit,
		Page:  page,
	}
	res := s.db.Order("created_at desc").
		Where("root = ?", true).
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
			slog.Warn("could not save discord message", "error", res.Error, "msg_id", msg.MessageID)
			continue
		}
	}
	return nil
}

func (s *Store) ShareContentWithGroup(contentID, groupID string) error {
	err := s.db.Model(&model.Content{
		Base: model.Base{
			ID: uuid.MustParse(contentID),
		},
	}).Association("Groups").Append(&model.Group{
		Base: model.Base{
			ID: uuid.MustParse(groupID),
		},
	})
	if err != nil {
		return errors.Wrapf(err, "could not share content with group")
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

func (s *Store) saveOrUpdateContent(data *content.Content, root bool) (*model.Content, error) {
	var (
		c     *model.Content
		found bool
		tags  []*model.Tag
	)

	for _, tagName := range data.Tags {
		var tag model.Tag
		if err := s.db.FirstOrCreate(&tag, model.Tag{Name: tagName}).Error; err != nil {
			return nil, err
		}
		tags = append(tags, &tag)
	}

	switch t := data.Type.(type) {
	case *content.Content_Data:
		switch u := t.Data.Type.(type) {
		case *content.Data_Url:
			if r := s.db.First(&c, datatypes.JSONQuery("content_data").Equals(u.Url.Url, "data", "url", "url")); r.Error != nil {
				if !errors.Is(r.Error, gorm.ErrRecordNotFound) {
					return nil, errors.Wrapf(r.Error, "could not get content")
				}
			} else {
				found = true
			}
		}
	}
	var res *gorm.DB
	if !found {
		c = &model.Content{
			ContentData: &model.ContentData{
				Data: data,
			},
			Root:       root,
			VisitCount: 1,
			Tags:       tags,
		}
		res = s.db.Create(c)
	} else {
		// TODO breadchris we currently ignore tag updates for this case
		res = s.db.Model(c).Update("visit_count", gorm.Expr("visit_count + ?", 1))
	}
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not save content")
	}
	return c, nil
}

func (s *Store) UpsertTags(tags []string) error {
	for _, tag := range tags {
		res := s.db.Clauses(clause.OnConflict{DoNothing: true}).Create(&model.Tag{
			Name: tag,
		})
		if res.Error != nil {
			return errors.Wrapf(res.Error, "could not save tag")
		}
	}
	return nil
}

func (s *Store) SaveContent(data *content.Content, related []*content.Content) (uuid.UUID, error) {
	c, err := s.saveOrUpdateContent(data, true)
	if err != nil {
		return uuid.Nil, errors.Wrapf(err, "unable to save content")
	}
	if related != nil {
		var relMod []*model.Content
		for _, rel := range related {
			rm, err := s.saveOrUpdateContent(rel, false)
			if err != nil {
				return uuid.UUID{}, errors.Wrapf(err, "unable to save related content")
			}
			relMod = append(relMod, rm)
		}
		c.RelatedContent = relMod
		if res := s.db.Save(c); res.Error != nil {
			return uuid.UUID{}, errors.Wrapf(res.Error, "unable to save related content")
		}
	}
	return c.ID, nil
}

func (s *Store) ValidGroupInvite(secret string) (uuid.UUID, error) {
	var groupInvite model.GroupInvite
	res := s.db.Where("secret = ?", secret).First(&groupInvite)
	if res.Error != nil {
		return uuid.UUID{}, errors.Wrapf(res.Error, "could not get group invite")
	}
	return groupInvite.GroupID, nil
}

func (s *Store) GetGroupByID(groupID uuid.UUID) (*model.Group, error) {
	group := &model.Group{
		Base: model.Base{
			ID: groupID,
		},
	}
	res := s.db.Model(group).First(group)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get group invite")
	}
	return group, nil
}

func (s *Store) CreateGroupInvite(groupID uuid.UUID) (string, error) {
	secret := uuid.New().String()
	res := s.db.Create(&model.GroupInvite{
		GroupID: groupID,
		Secret:  secret,
	})
	if res.Error != nil {
		return "", errors.Wrapf(res.Error, "could not create group invite")
	}
	return secret, nil
}

func (s *Store) CreateGroup(creator uuid.UUID, data *user.Group) (uuid.UUID, error) {
	group := &model.Group{
		Data: datatypes.JSONType[*user.Group]{
			Data: data,
		},
	}
	res := s.db.Create(group)
	if res.Error != nil {
		return uuid.UUID{}, errors.Wrapf(res.Error, "could not create group")
	}
	groupUser := &model.GroupUser{
		UserID:  creator,
		GroupID: group.ID,
		Role:    "admin",
	}
	res = s.db.Create(groupUser)
	if res.Error != nil {
		return uuid.UUID{}, errors.Wrapf(res.Error, "could not create group user")
	}
	return group.ID, nil
}

func (s *Store) DeleteGroup(groupID uuid.UUID) error {
	g := &model.Group{
		Base: model.Base{
			ID: groupID,
		},
	}
	res := s.db.Delete(g)
	if res.Error != nil {
		return errors.Wrapf(res.Error, "could not delete group")
	}
	return nil
}

func (s *Store) GetGroupsForUser(userID uuid.UUID) ([]model.GroupUser, error) {
	u := &model.User{}
	res := s.db.Preload("GroupUsers.Group").First(u, userID, "id = ?", userID)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get groups for user")
	}
	return u.GroupUsers, nil
}

func (s *Store) JoinGroup(userID, groupID uuid.UUID) error {
	res := s.db.Create(&model.GroupUser{
		UserID:  userID,
		GroupID: groupID,
	})
	if res.Error != nil {
		return errors.Wrapf(res.Error, "could not join group")
	}
	return nil
}
