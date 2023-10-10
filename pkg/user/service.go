package user

import (
	"context"
	connectgo "github.com/bufbuild/connect-go"
	"github.com/google/uuid"
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/gen/user"
	"github.com/lunabrain-ai/lunabrain/gen/user/userconnect"
	"github.com/lunabrain-ai/lunabrain/pkg/db"
	"github.com/lunabrain-ai/lunabrain/pkg/db/model"
	"github.com/pkg/errors"
	"github.com/samber/lo"
	"log/slog"
)

type UserService struct {
	db   *db.Store
	sess *db.Session
}

var _ userconnect.UserServiceHandler = (*UserService)(nil)

var ProviderSet = wire.NewSet(
	NewService,
)

func NewService(
	db *db.Store,
	sess *db.Session,
) *UserService {
	return &UserService{
		db:   db,
		sess: sess,
	}
}

func (s *UserService) UpdateConfig(ctx context.Context, c *connectgo.Request[user.Config]) (*connectgo.Response[user.Empty], error) {
	id, err := s.sess.GetUserID(ctx)
	if err != nil {
		return nil, err
	}
	u, err := s.sess.GetUserByID(id)
	if err != nil {
		return nil, err
	}
	u.Data.Data.Config = c.Msg
	err = s.sess.UpdateUser(id, u.Data.Data)
	if err != nil {
		return nil, err
	}
	return connectgo.NewResponse(&user.Empty{}), err
}

func (s *UserService) Register(ctx context.Context, c *connectgo.Request[user.User]) (*connectgo.Response[user.User], error) {
	_, err := s.sess.GetUser(c.Msg)
	if err == nil {
		return nil, errors.New("user already exists")
	}
	u, err := s.sess.NewUser(c.Msg)
	if err != nil {
		return nil, errors.Wrapf(err, "could not create user")
	}
	s.sess.SetUserID(ctx, u.ID.String())
	return connectgo.NewResponse(&user.User{
		Email: u.Data.Data.Email,
	}), nil
}

func (s *UserService) Login(ctx context.Context, c *connectgo.Request[user.User]) (*connectgo.Response[user.User], error) {
	if id, err := s.sess.GetUserID(ctx); err == nil {
		u, err := s.sess.GetUserByID(id)
		if err != nil {
			return nil, err
		}
		return connectgo.NewResponse(&user.User{
			Email:  u.Data.Data.Email,
			Config: u.Data.Data.Config,
		}), nil
	}

	u, err := s.sess.GetUser(c.Msg)
	if err != nil {
		slog.Warn("could not find user", "error", err)
		return connectgo.NewResponse(&user.User{
			Email: "",
		}), nil
	}

	// TODO breadchris compare hashed passwords
	if u.Data.Data.Password != c.Msg.Password {
		return nil, errors.New("invalid password")
	}
	s.sess.SetUserID(ctx, u.ID.String())
	return connectgo.NewResponse(&user.User{
		Email: u.Data.Data.Email,
	}), nil
}

func (s *UserService) Logout(ctx context.Context, c *connectgo.Request[user.Empty]) (*connectgo.Response[user.Empty], error) {
	s.sess.ClearUserID(ctx)
	return connectgo.NewResponse(&user.Empty{}), nil
}

func (s *UserService) CreateGroupInvite(ctx context.Context, c *connectgo.Request[user.Group]) (*connectgo.Response[user.GroupInvite], error) {
	id, err := s.sess.GetUserID(ctx)
	if err != nil {
		return nil, err
	}
	groups, err := s.db.GetGroupsForUser(uuid.MustParse(id))
	if err != nil {
		return nil, err
	}

	if !lo.ContainsBy(groups, func(g model.Group) bool {
		return g.ID == uuid.MustParse(c.Msg.Id)
	}) {
		return nil, errors.New("user is not a member of this group")
	}

	secret, err := s.db.CreateGroupInvite(uuid.MustParse(c.Msg.Id))
	if err != nil {
		return nil, err
	}
	return connectgo.NewResponse(&user.GroupInvite{
		Secret: secret,
	}), nil
}

func (s *UserService) JoinGroup(ctx context.Context, c *connectgo.Request[user.GroupInvite]) (*connectgo.Response[user.Group], error) {
	id, err := s.sess.GetUserID(ctx)
	if err != nil {
		return nil, err
	}
	gID, err := s.db.ValidGroupInvite(c.Msg.Secret)
	if err != nil {
		return nil, errors.New("invalid group invite")
	}
	err = s.db.JoinGroup(uuid.MustParse(id), gID)
	if err != nil {
		return nil, err
	}
	return connectgo.NewResponse(&user.Group{
		Id: gID.String(),
	}), nil
}

func (s *UserService) CreateGroup(ctx context.Context, c *connectgo.Request[user.Group]) (*connectgo.Response[user.Group], error) {
	id, err := s.sess.GetUserID(ctx)
	if err != nil {
		return nil, err
	}
	gID, err := s.db.CreateGroup(uuid.MustParse(id), c.Msg)
	if err != nil {
		return nil, err
	}
	return connectgo.NewResponse(&user.Group{
		Id: gID.String(),
	}), nil
}

func (s *UserService) GetGroups(ctx context.Context, c *connectgo.Request[user.Empty]) (*connectgo.Response[user.Groups], error) {
	id, err := s.sess.GetUserID(ctx)
	if err != nil {
		return nil, err
	}
	groups, err := s.db.GetGroupsForUser(uuid.MustParse(id))
	if err != nil {
		return nil, err
	}
	var groupsProto []*user.Group
	for _, g := range groups {
		groupsProto = append(groupsProto, g.Data.Data)
	}
	return connectgo.NewResponse(&user.Groups{
		Groups: groupsProto,
	}), nil
}

func (s *UserService) DeleteGroup(ctx context.Context, c *connectgo.Request[user.Group]) (*connectgo.Response[user.Empty], error) {
	id, err := s.sess.GetUserID(ctx)
	if err != nil {
		return nil, err
	}
	err = s.db.DeleteGroup(uuid.MustParse(id))
	return connectgo.NewResponse(&user.Empty{}), err
}
