package db

import (
	"github.com/google/uuid"
	genapi "github.com/lunabrain-ai/lunabrain/gen"
	model2 "github.com/lunabrain-ai/lunabrain/pkg/db/model"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type Session struct {
	db *gorm.DB
}

func NewSession(db *gorm.DB) (*Session, error) {
	// TODO breadchris migration should be done via a migration tool, no automigrate
	log.Info().Msg("migrating database")
	err := db.AutoMigrate(
		&model2.Session{},
		&model2.Segment{},
		&model2.Prompt{},
		&model2.User{},
	)
	if err != nil {
		return nil, errors.Wrapf(err, "could not migrate database: %v", err)
	}
	return &Session{db: db}, nil
}

func (s *Session) NewSession(userID string, ps *genapi.Session) (*model2.Session, error) {
	var id uuid.UUID
	if ps.Id != "" {
		id = uuid.MustParse(ps.Id)
	} else {
		id = uuid.New()
	}
	session := &model2.Session{
		Base: model2.Base{
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
	res := s.db.Delete(&model2.Session{
		Base: model2.Base{
			ID: uuid.MustParse(id),
		},
	})
	if res.Error != nil {
		return errors.Wrapf(res.Error, "could not delete session")
	}
	return nil
}

func (s *Session) SaveSegment(segment *model2.Segment) error {
	res := s.db.Save(segment)
	if res.Error != nil {
		return errors.Wrapf(res.Error, "could not save segment")
	}
	return nil
}

func (s *Session) Get(id string) (*model2.Session, error) {
	v := &model2.Session{
		Base: model2.Base{
			ID: uuid.MustParse(id),
		},
	}
	res := s.db.Preload(clause.Associations).First(v)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get session")
	}
	return v, nil
}

func (s *Session) All(userID string, page, limit int) ([]model2.Session, *Pagination, error) {
	var content []model2.Session
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

func (s *Session) AllPrompts(page, limit int) ([]model2.Prompt, *Pagination, error) {
	var content []model2.Prompt
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

func (s *Session) NewPrompt(ps *genapi.Prompt) (*model2.Prompt, error) {
	var id uuid.UUID
	if ps.Id != "" {
		id = uuid.MustParse(ps.Id)
	} else {
		id = uuid.New()
	}
	p := &model2.Prompt{
		Base: model2.Base{
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

func (s *Session) GetUserByID(id string) (*model2.User, error) {
	p := &model2.User{
		Base: model2.Base{
			ID: uuid.MustParse(id),
		},
	}
	res := s.db.First(&p)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get user: %s", id)
	}
	return p, nil
}

func (s *Session) GetUser(ps *genapi.User) (*model2.User, error) {
	p := &model2.User{}
	res := s.db.First(&p, datatypes.JSONQuery("data").Equals(ps.Email, "email"))
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not get user")
	}
	return p, nil
}

func (s *Session) NewUser(ps *genapi.User) (*model2.User, error) {
	id := uuid.New()
	// TODO breadchris hash password
	p := &model2.User{
		Base: model2.Base{
			ID: id,
		},
		Data: datatypes.JSONType[*genapi.User]{
			Data: ps,
		},
	}
	res := s.db.Save(p)
	if res.Error != nil {
		return nil, errors.Wrapf(res.Error, "could not save p")
	}
	return p, nil
}
