package db

import (
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/gen/user"
	"github.com/lunabrain-ai/lunabrain/pkg/db/model"
	"github.com/pkg/errors"
	"gorm.io/datatypes"
)

func (s *Session) GetUserByID(id uuid.UUID) (*model.User, error) {
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

func (s *Session) GetUser(ps *user.User) (*model.User, error) {
	p := &model.User{}

	res := s.db.First(&p, datatypes.JSONQuery("data").Equals(ps.Email, "email"))
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get user: %s", ps.Email)
	}
	ok := CheckPasswordHash(ps.Password, p.PasswordHash)
	if !ok {
		return nil, errors.Errorf("could not get user: %s", ps.Email)
	}
	return p, nil
}

func (s *Session) NewUser(ps *user.User, bot bool) (*model.User, error) {
	id := uuid.New()
	// TODO breadchris hash password
	hash, err := HashPassword(ps.Password)
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

func (s *Session) UpdateUser(id uuid.UUID, ps *user.User) error {
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
