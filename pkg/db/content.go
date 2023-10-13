package db

import (
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/gen/content"
	"github.com/lunabrain-ai/lunabrain/pkg/db/model"
	"github.com/pkg/errors"
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

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

func (s *Store) VoteOnContent(userID uuid.UUID, contentID uuid.UUID) error {
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

func (s *Store) GetContentVotes(contentID uuid.UUID) ([]*model.Vote, error) {
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
