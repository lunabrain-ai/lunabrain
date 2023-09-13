package http

import (
	"github.com/alexedwards/scs/gormstore"
	"github.com/breadchris/scs/v2"
	"gorm.io/gorm"
)

type SessionManager struct {
	*scs.SessionManager
}

func NewSession(db *gorm.DB) (*SessionManager, error) {
	s := scs.New()
	var err error
	if s.Store, err = gormstore.New(db); err != nil {
		return nil, err
	}
	return &SessionManager{
		SessionManager: s,
	}, nil
}
