package user

import (
	"context"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/pkg/ent"
	"github.com/lunabrain-ai/lunabrain/pkg/ent/schema"
	entuser "github.com/lunabrain-ai/lunabrain/pkg/ent/user"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/user"
	"github.com/markbates/goth"
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

func (s *EntStore) GetUserByEmail(ctx context.Context, email string) (*ent.User, error) {
	return s.client.User.
		Query().
		Where(entuser.Email(email)).
		Only(ctx)
}

func (s *EntStore) ResetPassword(ctx context.Context, id uuid.UUID, password string) error {
	hash, err := hashPassword(password)
	if err != nil {
		return errors.Wrapf(err, "could not hash password")
	}
	_, err = s.client.User.
		UpdateOneID(id).
		SetPasswordHash(hash).
		Save(ctx)
	return err
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

func (s *EntStore) NewUser(ctx context.Context, ps *user.User, oauth goth.User) (*ent.User, error) {
	u := s.client.User.
		Create().
		SetData(schema.UserEncoder{
			User: ps,
		})

	// TODO breadchris handle user/pass vs oauth more robustly
	if ps.Password != "" {
		hash, err := hashPassword(ps.Password)
		if err != nil {
			return nil, errors.Wrapf(err, "could not hash password")
		}
		ps.Password = ""
		u.SetEmail(ps.Email).
			SetPasswordHash(hash)
	} else {
		if oauth.Email != "" {
			u.SetOauthUser(oauth).
				SetEmail(oauth.Email).
				SetVerified(true)
		}
	}
	return u.Save(ctx)
}

func (s *EntStore) NewUserVerifySecret(ctx context.Context, u *ent.User) (uuid.UUID, error) {
	secret := uuid.New()
	_, err := s.client.User.
		UpdateOneID(u.ID).
		SetVerifySecret(secret).
		Save(ctx)
	if err != nil {
		return uuid.UUID{}, err
	}
	return secret, nil
}

func (s *EntStore) VerifyUser(ctx context.Context, secret uuid.UUID) error {
	_, err := s.client.User.
		Update().
		Where(entuser.VerifySecret(secret)).
		SetVerified(true).
		Save(ctx)
	return err
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
