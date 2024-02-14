package http

import (
	"context"
	"github.com/breadchris/scs/v2"
	"github.com/google/uuid"
	"github.com/justshare-io/justshare/pkg/ent"
	"github.com/pkg/errors"
)

const (
	UserIDCtxKey = "user"
)

var (
	UserLoginError = errors.New("user not logged in")
)

type SessionManager struct {
	*scs.SessionManager
}

func NewSession(client *ent.Client) (*SessionManager, error) {
	s := scs.New()
	var err error
	if s.Store, err = NewEntStore(client); err != nil {
		return nil, err
	}
	return &SessionManager{
		SessionManager: s,
	}, nil
}

func (s *SessionManager) GetUserID(ctx context.Context) (uuid.UUID, error) {
	userID := s.GetString(ctx, UserIDCtxKey)
	if userID == "" {
		return uuid.UUID{}, UserLoginError
	}
	return uuid.Parse(userID)
}

func (s *SessionManager) SetUserID(ctx context.Context, id string) {
	s.Put(ctx, UserIDCtxKey, id)
}

func (s *SessionManager) ClearUserID(ctx context.Context) {
	s.Remove(ctx, UserIDCtxKey)
}
