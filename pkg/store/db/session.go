package db

import (
	"github.com/google/uuid"
	genapi "github.com/lunabrain-ai/lunabrain/gen"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db/model"
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
		&model.Session{},
		&model.Segment{},
		&model.Prompt{},
	)
	if err != nil {
		return nil, errors.Wrapf(err, "could not migrate database: %v", err)
	}
	return &Session{db: db}, nil
}

func (s *Session) NewSession(ps *genapi.Session) (*model.Session, error) {
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

func (s *Session) All(page, limit int) ([]model.Session, *Pagination, error) {
	var content []model.Session
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
