package group

import (
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/gen/user"
	"github.com/lunabrain-ai/lunabrain/pkg/db"
	"github.com/lunabrain-ai/lunabrain/pkg/db/model"
	"github.com/pkg/errors"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type GormStore struct {
	db *gorm.DB
}

func NewGormStore(store *db.GormStore) *GormStore {
	return &GormStore{
		db: store.DB(),
	}
}

func (s *GormStore) ValidGroupInvite(secret string) (uuid.UUID, error) {
	var groupInvite model.GroupInvite
	res := s.db.Where("secret = ?", secret).First(&groupInvite)
	if res.Error != nil {
		return uuid.UUID{}, errors.Wrapf(res.Error, "could not get group invite")
	}
	return groupInvite.GroupID, nil
}

func (s *GormStore) GetGroupByID(groupID uuid.UUID) (*model.Group, error) {
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

func (s *GormStore) CreateGroupInvite(groupID uuid.UUID) (string, error) {
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

func (s *GormStore) CreateGroup(creator uuid.UUID, data *user.Group) (uuid.UUID, error) {
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

func (s *GormStore) DeleteGroup(groupID uuid.UUID) error {
	g := &model.Group{
		Base: model.Base{
			ID: groupID,
		},
	}
	res := s.db.Unscoped().Delete(g)
	if res.Error != nil {
		return errors.Wrapf(res.Error, "could not delete group")
	}
	return nil
}

func (s *GormStore) ShareContent(contentID, groupID string) error {
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
