package user

import (
	"github.com/google/uuid"
	"github.com/justshare-io/justshare/pkg/db"
	"github.com/justshare-io/justshare/pkg/db/model"
	"github.com/justshare-io/justshare/pkg/gen/user"
	"github.com/pkg/errors"
	"gorm.io/datatypes"
	"gorm.io/gorm"
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

func (s *GormStore) GetGroups(userID uuid.UUID) ([]model.GroupUser, error) {
	u := &model.User{
		Base: model.Base{
			ID: userID,
		},
	}
	res := s.db.Preload("GroupUsers.Group").First(u)
	if res.Error != nil {
		slog.Warn("could not get groups for user", "error", res.Error)
		return []model.GroupUser{}, nil
	}
	return u.GroupUsers, nil
}

func (s *GormStore) JoinGroup(userID, groupID uuid.UUID) error {
	res := s.db.Create(&model.GroupUser{
		UserID:  userID,
		GroupID: groupID,
	})
	if res.Error != nil {
		return errors.Wrapf(res.Error, "could not join group")
	}
	return nil
}

func (s *GormStore) GetUserByID(id uuid.UUID) (*model.User, error) {
	p := &model.User{
		Base: model.Base{
			ID: id,
		},
	}
	res := s.db.First(&p)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get user: %s", id)
	}
	return p, nil
}

func (s *GormStore) AttemptLogin(email, password string) (*model.User, error) {
	p := &model.User{}

	res := s.db.First(&p, datatypes.JSONQuery("data").Equals(email, "email"))
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get user: %s", email)
	}
	ok := checkPasswordHash(password, p.PasswordHash)
	if !ok {
		return nil, errors.Errorf("could not get user: %s", email)
	}
	return p, nil
}

func (s *GormStore) NewUser(ps *user.User, bot bool) (*model.User, error) {
	id := uuid.New()
	hash, err := hashPassword(ps.Password)
	if err != nil {
		return nil, errors.Wrapf(err, "could not hash password")
	}
	ps.Password = ""
	p := &model.User{
		Base: model.Base{
			ID: id,
		},
		PasswordHash: hash,
		Data: datatypes.JSONType[*user.User]{
			Data: ps,
		},
	}
	res := s.db.Save(p)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not save p")
	}
	return p, nil
}

func (s *GormStore) UpdateUser(id uuid.UUID, ps *user.User) error {
	// TODO breadchris update other user fields
	u := &model.User{
		Base: model.Base{
			ID: id,
		},
	}
	if res := s.db.Model(u).Update("data", datatypes.JSONType[*user.User]{
		Data: ps,
	}); res.Error != nil {
		return errors.Wrapf(res.Error, "could not update user")
	}
	return nil
}
