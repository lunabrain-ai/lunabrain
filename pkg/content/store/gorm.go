package store

import (
	"github.com/google/uuid"
	"github.com/justshare-io/justshare/pkg/db"
	"github.com/justshare-io/justshare/pkg/db/model"
	"github.com/justshare-io/justshare/pkg/gen/content"
	"github.com/pkg/errors"
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"log/slog"
)

type GormStore struct {
	db *gorm.DB
}

func NewGormStore(store *db.GormStore) *GormStore {
	return &GormStore{
		db: store.DB(),
	}
}

func (s *GormStore) DeleteContent(id uuid.UUID) error {
	res := s.db.Unscoped().Delete(&model.Content{
		Base: model.Base{
			ID: id,
		},
	})
	if res.Error != nil {
		return errors.Wrapf(res.Error, "could not delete content")
	}
	return nil
}

func (s *GormStore) UpsertTags(tags []string) error {
	// TODO breadchris validate tags
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

func (s *GormStore) saveOrUpdateContent(userID uuid.UUID, botID uuid.UUID, data *content.Content, root bool) (*model.Content, error) {
	var (
		found bool
		tags  []*model.Tag
	)

	// TODO breadchris validate tags
	for _, tagName := range data.Tags {
		var tag model.Tag
		if err := s.db.FirstOrCreate(&tag, model.Tag{Name: tagName}).Error; err != nil {
			return nil, err
		}
		tags = append(tags, &tag)
	}

	c := &model.Content{}
	switch t := data.Type.(type) {
	case *content.Content_Data:
		switch u := t.Data.Type.(type) {
		case *content.Data_Url:
			if userID != uuid.Nil {
				if r := s.db.Model(c).
					Where("user_id = ?", userID).
					First(c, datatypes.JSONQuery("content_data").
						Equals(u.Url.Url, "data", "url", "url")); r.Error != nil {
					if !errors.Is(r.Error, gorm.ErrRecordNotFound) {
						return nil, errors.Wrapf(r.Error, "could not get content")
					}
				} else {
					found = true
				}
			}
		}
	}

	if !found && data.Id != "" {
		if r := s.db.Model(c).
			Where("id = ?", data.Id).
			First(c); r.Error != nil {
			if !errors.Is(r.Error, gorm.ErrRecordNotFound) {
				return nil, errors.Wrapf(r.Error, "could not get content")
			}
		} else {
			found = true
		}
	}

	var bots []*model.Bot
	if botID != uuid.Nil {
		bots = []*model.Bot{
			{
				Base: model.Base{
					ID: botID,
				},
			},
		}
	}
	var res *gorm.DB
	if !found {
		c = &model.Content{
			// TODO breadchris probably want to use Users instead of UserID
			UserID: userID,
			Bots:   bots,
			ContentData: &model.ContentData{
				Data: data,
			},
			Root:       root,
			VisitCount: 1,
			Tags:       tags,
		}
		if data.Id != "" {
			c.ID = uuid.MustParse(data.Id)
		}
		res = s.db.Create(c)
	} else {
		// TODO breadchris we currently ignore tag updates for this case
		// TODO breadchris multiple users cant add the same url
		res = s.db.Model(c).
			Update("visit_count", gorm.Expr("visit_count + ?", 1)).
			Update("content_data", &model.ContentData{
				Data: data,
			})
	}
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not save content")
	}
	return c, nil
}

func (s *GormStore) SaveContent(userID uuid.UUID, botID uuid.UUID, data *content.Content, related []*content.Content) (uuid.UUID, error) {
	c, err := s.saveOrUpdateContent(userID, botID, data, true)
	if err != nil {
		return uuid.Nil, errors.Wrapf(err, "unable to save content")
	}
	if related != nil {
		var relMod []*model.Content
		for _, rel := range related {
			rm, err := s.saveOrUpdateContent(userID, botID, rel, false)
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

func (s *GormStore) SearchContent(userID uuid.UUID, page, limit int, groupID string, tags []string) ([]model.Content, error) {
	var c []model.Content
	query := s.db.
		Distinct().
		Select("contents.*").
		Joins("LEFT JOIN content_tags ON content_tags.content_id = contents.id").
		Joins("LEFT JOIN tags ON tags.id = content_tags.tag_id")

	if groupID != "" {
		slog.Debug("searching for group content", "group_id", groupID)
		query = query.
			Joins("JOIN group_content ON group_content.content_id = contents.id").
			Where("group_content.group_id = ?", groupID)
	}

	query = query.
		Where("root = ?", true).
		Where("user_id = ?", userID)

	// If tagNames provided, add a WHERE condition for those tags
	if len(tags) > 0 {
		query = query.Where("tags.name IN ?", tags)
	}

	res := query.
		Order("contents.created_at desc").
		Preload(clause.Associations).
		Find(&c)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get content")
	}

	return c, nil
}

func (s *GormStore) GetContentByID(contentID uuid.UUID) (*model.Content, error) {
	var cnt model.Content
	res := s.db.Where("id = ?", contentID).Preload(clause.Associations).First(&cnt)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get cnt")
	}
	return &cnt, nil
}

func (s *GormStore) SetTags(contentID uuid.UUID, tags []string) error {
	// TODO breadchris validate tags
	var tagModels []*model.Tag
	for _, tagName := range tags {
		var tag model.Tag
		if err := s.db.FirstOrCreate(&tag, model.Tag{Name: tagName}).Error; err != nil {
			return err
		}
		tagModels = append(tagModels, &tag)
	}
	cnt := &model.Content{
		Base: model.Base{
			ID: contentID,
		},
	}
	err := s.db.Model(cnt).Association("Tags").Clear()
	if err != nil {
		return errors.Wrapf(err, "could not clear tags")
	}

	if err := s.db.Preload("Tags").First(cnt).Error; err != nil {
		return errors.Wrapf(err, "could not set tags")
	}

	cnt.Tags = tagModels
	if err := s.db.Save(cnt).Error; err != nil {
		return errors.Wrapf(err, "could not set tags")
	}
	return nil
}

func (s *GormStore) GetTags() ([]string, error) {
	var tags []model.Tag

	// TODO breadchris restrict tags to a group?
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

func (s *GormStore) VoteOnContent(userID uuid.UUID, contentID uuid.UUID) error {
	v := &model.Vote{
		UserID:    userID,
		ContentID: contentID,
	}
	var found model.Vote
	res := s.db.Model(v).Where("user_id = ? AND content_id = ?", userID, contentID).First(&found)
	if res.Error == nil {
		res = s.db.Model(v).Delete(&found)
		if res.Error != nil {
			return errors.Wrapf(res.Error, "could not vote on content")
		}
		return nil
	}
	res = s.db.Create(v)
	if res.Error != nil {
		return errors.Wrapf(res.Error, "could not vote on content")
	}
	return nil
}

func (s *GormStore) GetContentVotes(contentID uuid.UUID) ([]*model.Vote, error) {
	v := &model.Content{
		Base: model.Base{
			ID: contentID,
		},
	}
	err := s.db.Model(v).Association("Votes").Find(&v.Votes)
	if err != nil {
		return nil, errors.Wrapf(err, "could not get votes")
	}
	return v.Votes, nil
}

func (s *GormStore) GetTagsForGroup(groupID uuid.UUID) ([]string, error) {
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
