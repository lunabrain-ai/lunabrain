package user

import (
	"context"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/pkg/ent"
	"github.com/lunabrain-ai/lunabrain/pkg/ent/schema"
	entuser "github.com/lunabrain-ai/lunabrain/pkg/ent/user"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/user"
	"github.com/pkg/errors"
	"log/slog"
)

type EntStore struct {
	client *ent.Client
}

func NewEntStore(client *ent.Client) *EntStore {
	return &EntStore{
		client: client,
	}
}

func (s *EntStore) GetGroups(ctx context.Context, userID uuid.UUID) ([]*ent.GroupUser, error) {
	u, err := s.client.User.Query().
		Where(entuser.ID(userID)).
		QueryGroupUsers().
		WithGroup().
		WithUser().
		All(ctx)
	if err != nil {
		slog.Warn("could not get groups for entuser", "error", err)
		return nil, err
	}
	return u, nil
}

func (s *EntStore) JoinGroup(ctx context.Context, userID, groupID uuid.UUID) error {
	_, err := s.client.GroupUser.
		Create().
		SetUserID(userID).
		SetGroupID(groupID).
		SetRole("user").
		Save(ctx)
	return err
}

func (s *EntStore) GetUserByID(ctx context.Context, id uuid.UUID) (*ent.User, error) {
	return s.client.User.
		Get(ctx, id)
}

func (s *EntStore) AttemptLogin(ctx context.Context, email, password string) (*ent.User, error) {
	u, err := s.client.User.
		Query().
		Where(entuser.Email(email)).
		Only(ctx)
	if err != nil {
		return nil, err
	}
	ok := checkPasswordHash(password, u.PasswordHash)
	if !ok {
		return nil, errors.New("invalid password")
	}
	return u, nil
}

func (s *EntStore) NewUser(ctx context.Context, ps *user.User, bot bool) (*ent.User, error) {
	hash, err := hashPassword(ps.Password)
	if err != nil {
		return nil, errors.Wrapf(err, "could not hash password")
	}
	ps.Password = ""

	return s.client.User.
		Create().
		SetID(uuid.New()).
		SetPasswordHash(hash).
		SetEmail(ps.Email).
		SetData(schema.UserEncoder{
			User: ps,
		}).
		Save(ctx)
}

func (s *EntStore) UpdateUser(ctx context.Context, id uuid.UUID, ps *user.User) error {
	_, err := s.client.User.
		UpdateOneID(id).
		SetData(schema.UserEncoder{
			User: ps,
		}).
		Save(ctx)
	return err
}
