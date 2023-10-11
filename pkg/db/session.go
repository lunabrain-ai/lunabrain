package db

import (
	"context"
	"github.com/google/uuid"
	genapi "github.com/lunabrain-ai/lunabrain/gen"
	"github.com/lunabrain-ai/lunabrain/gen/user"
	"github.com/lunabrain-ai/lunabrain/pkg/db/model"
	"github.com/lunabrain-ai/lunabrain/pkg/http"
	"github.com/pkg/errors"
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
	"log/slog"
)

const (
	UserIDCtxKey = "user"
)

var (
	UserLoginError = errors.New("user not logged in")
)

type Session struct {
	db      *gorm.DB
	sessMan *http.SessionManager
}

func NewSession(db *gorm.DB, sessMan *http.SessionManager) (*Session, error) {
	// TODO breadchris migration should be done via a migration tool, no automigrate
	slog.Info("migrating database")
	err := db.AutoMigrate(
		&model.Session{},
		&model.Segment{},
		&model.Prompt{},
	)
	if err != nil {
		return nil, errors.Wrapf(err, "could not migrate database: %v", err)
	}
	return &Session{
		db:      db,
		sessMan: sessMan,
	}, nil
}

func (s *Session) GetUserID(ctx context.Context) (string, error) {
	id := s.sessMan.GetString(ctx, UserIDCtxKey)
	if id == "" {
		return "", UserLoginError
	}
	return id, nil
}

func (s *Session) SetUserID(ctx context.Context, id string) {
	s.sessMan.Put(ctx, UserIDCtxKey, id)
}

func (s *Session) ClearUserID(ctx context.Context) {
	s.sessMan.Remove(ctx, UserIDCtxKey)
}

func (s *Session) NewSession(userID string, ps *genapi.Session) (*model.Session, error) {
	var id uuid.UUID
	if ps.Id != "" {
		id = uuid.MustParse(ps.Id)
	} else {
		id = uuid.New()
	}
	session := &model.Session{
		Base: model.Base{
			ID: id,
		},
		UserID: uuid.MustParse(userID),
		Data: datatypes.JSONType[*genapi.Session]{
			Data: ps,
		},
	}
	res := s.db.Save(session)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not save session")
	}
	return session, nil
}

func (s *Session) DeleteSession(id string) error {
	res := s.db.Delete(&model.Session{
		Base: model.Base{
			ID: uuid.MustParse(id),
		},
	})
	if res.Error != nil {
		return errors.Wrapf(res.Error, "could not delete session")
	}
	return nil
}

func (s *Session) SaveSegment(segment *model.Segment) error {
	res := s.db.Save(segment)
	if res.Error != nil {
		return errors.Wrapf(res.Error, "could not save segment")
	}
	return nil
}

func (s *Session) Get(id string) (*model.Session, error) {
	v := &model.Session{
		Base: model.Base{
			ID: uuid.MustParse(id),
		},
	}
	res := s.db.Preload(clause.Associations).First(v)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get session")
	}
	return v, nil
}

func (s *Session) All(userID string, page, limit int) ([]model.Session, *Pagination, error) {
	var content []model.Session
	pagination := Pagination{
		Limit: limit,
		Page:  page,
	}
	res := s.db.Order("created_at desc").
		Scopes(paginate(content, &pagination, s.db)).
		Preload(clause.Associations).
		Find(&content, "user_id = ?", userID)
	if res.Error != nil {
		return nil, nil, errors.Wrapf(res.Error, "could not get content")
	}

	return content, &pagination, nil
}

func (s *Session) AllPrompts(page, limit int) ([]model.Prompt, *Pagination, error) {
	var content []model.Prompt
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

	return content, &pagination, nil
}

func (s *Session) NewPrompt(ps *genapi.Prompt) (*model.Prompt, error) {
	var id uuid.UUID
	if ps.Id != "" {
		id = uuid.MustParse(ps.Id)
	} else {
		id = uuid.New()
	}
	p := &model.Prompt{
		Base: model.Base{
			ID: id,
		},
		Data: datatypes.JSONType[*genapi.Prompt]{
			Data: ps,
		},
	}
	res := s.db.Save(p)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not save p")
	}
	return p, nil
}

func (s *Session) GetUserByID(id string) (*model.User, error) {
	p := &model.User{
		Base: model.Base{
			ID: uuid.MustParse(id),
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
		return nil, errors.Wrapf(res.Error, "could not get user: %s", ps.Email)
	}
	return p, nil
}

func (s *Session) NewUser(ps *user.User) (*model.User, error) {
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

func (s *Session) UpdateUser(id string, ps *user.User) error {
	// TODO breadchris update other user fields
	u := &model.User{
		Base: model.Base{
			ID: uuid.MustParse(id),
		},
	}
	if res := s.db.Model(u).Update("data", datatypes.JSONType[*user.User]{
		Data: ps,
	}); res.Error != nil {
		return errors.Wrapf(res.Error, "could not update user")
	}
	return nil
}
