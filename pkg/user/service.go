package user

import (
	"context"
	connectgo "github.com/bufbuild/connect-go"
	"github.com/google/uuid"
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/gen/user"
	"github.com/lunabrain-ai/lunabrain/gen/user/userconnect"
	"github.com/lunabrain-ai/lunabrain/pkg/db"
	"github.com/pkg/errors"
	"google.golang.org/protobuf/types/known/emptypb"
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

func (s *UserService) UpdateConfig(ctx context.Context, c *connectgo.Request[user.Config]) (*connectgo.Response[emptypb.Empty], error) {
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
	return connectgo.NewResponse(&emptypb.Empty{}), err
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
	s.sess.SetUserID(ctx, u.ID.String())
	return connectgo.NewResponse(&user.User{
		Email: u.Data.Data.Email,
	}), nil
}

func (s *UserService) Logout(ctx context.Context, c *connectgo.Request[emptypb.Empty]) (*connectgo.Response[emptypb.Empty], error) {
	s.sess.ClearUserID(ctx)
	return connectgo.NewResponse(&emptypb.Empty{}), nil
}

func (s *UserService) CreateGroupInvite(ctx context.Context, c *connectgo.Request[user.GroupID]) (*connectgo.Response[user.GroupInvite], error) {
	role, err := s.userGroupRole(ctx, c.Msg.GroupId)
	if err != nil {
		return nil, err
	}
	if role != "admin" {
		return nil, errors.New("user is not an admin of this group")
	}

	secret, err := s.db.CreateGroupInvite(uuid.MustParse(c.Msg.GroupId))
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
	err = s.db.JoinGroup(id, gID)
	if err != nil {
		return nil, err
	}
	return connectgo.NewResponse(&user.Group{
		Id: gID.String(),
	}), nil
}

func (s *UserService) GroupInfo(ctx context.Context, c *connectgo.Request[user.GroupInfoRequest]) (*connectgo.Response[user.Group], error) {
	gID, err := s.db.ValidGroupInvite(c.Msg.Secret)
	if err != nil {
		return nil, errors.New("invalid group invite")
	}
	g, err := s.db.GetGroupByID(gID)
	if err != nil {
		return nil, err
	}
	return connectgo.NewResponse(&user.Group{
		Id:   gID.String(),
		Name: g.Data.Data.Name,
	}), nil
}

func (s *UserService) CreateGroup(ctx context.Context, c *connectgo.Request[user.Group]) (*connectgo.Response[user.Group], error) {
	id, err := s.sess.GetUserID(ctx)
	if err != nil {
		return nil, err
	}
	gID, err := s.db.CreateGroup(id, c.Msg)
	if err != nil {
		return nil, err
	}
	return connectgo.NewResponse(&user.Group{
		Id: gID.String(),
	}), nil
}

func (s *UserService) GetGroups(ctx context.Context, c *connectgo.Request[emptypb.Empty]) (*connectgo.Response[user.Groups], error) {
	id, err := s.sess.GetUserID(ctx)
	if err != nil {
		return nil, err
	}
	groups, err := s.db.GetGroupsForUser(id)
	if err != nil {
		return nil, err
	}
	var groupsProto []*user.Group
	for _, g := range groups {
		d := g.Group.Data.Data
		if d == nil {
			slog.Warn("group data is nil", "group", g.GroupID)
			continue
		}
		d.Id = g.GroupID.String()
		groupsProto = append(groupsProto, d)
	}
	return connectgo.NewResponse(&user.Groups{
		Groups: groupsProto,
	}), nil
}

func (s *UserService) userGroupRole(ctx context.Context, groupID string) (string, error) {
	id, err := s.sess.GetUserID(ctx)
	if err != nil {
		return "", err
	}
	groups, err := s.db.GetGroupsForUser(id)
	if err != nil {
		return "", err
	}

	for _, g := range groups {
		if g.GroupID.String() == groupID {
			return g.Role, nil
		}
	}
	return "", errors.Errorf("user is not a member of this group: %s", groupID)
}

func (s *UserService) DeleteGroup(ctx context.Context, c *connectgo.Request[user.Group]) (*connectgo.Response[emptypb.Empty], error) {
	role, err := s.userGroupRole(ctx, c.Msg.Id)
	if err != nil {
		return nil, err
	}
	if role != "admin" {
		return nil, errors.New("user is not an admin of this group")
	}
	err = s.db.DeleteGroup(uuid.MustParse(c.Msg.Id))
	return connectgo.NewResponse(&emptypb.Empty{}), err
}

func (s *UserService) Share(ctx context.Context, c *connectgo.Request[user.ShareRequest]) (*connectgo.Response[emptypb.Empty], error) {
	role, err := s.userGroupRole(ctx, c.Msg.GroupId)
	if err != nil {
		return nil, err
	}
	if role == "" {
		return nil, errors.New("user does not have valid role")
	}
	err = s.db.ShareContentWithGroup(c.Msg.ContentId, c.Msg.GroupId)
	if err != nil {
		return nil, err
	}
	return connectgo.NewResponse(&emptypb.Empty{}), nil
}
