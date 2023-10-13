package db

import (
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/gen/user"
	"github.com/lunabrain-ai/lunabrain/pkg/db/model"
	"github.com/pkg/errors"
	"gorm.io/datatypes"
)

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
	u := &model.User{
		Base: model.Base{
			ID: userID,
		},
	}
	res := s.db.Preload("GroupUsers.Group").First(u)
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
	res := s.db.Preload("Content").Preload("Content.RelatedContent").Preload("Content.Votes").First(g)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get content")
	}
	return g.Content, nil
}
