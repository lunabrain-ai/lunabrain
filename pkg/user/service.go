package user

import (
	"context"
	connectgo "github.com/bufbuild/connect-go"
	"github.com/google/uuid"
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/user"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/user/userconnect"
	"github.com/lunabrain-ai/lunabrain/pkg/group"
	"github.com/lunabrain-ai/lunabrain/pkg/http"
	"github.com/pkg/errors"
	"google.golang.org/protobuf/types/known/emptypb"
	"log/slog"
)

type UserService struct {
	sess  *http.SessionManager
	user  *EntStore
	group *group.EntStore
}

var _ userconnect.UserServiceHandler = (*UserService)(nil)

var ProviderSet = wire.NewSet(
	NewService,
	NewEntStore,
)

func NewService(
	group *group.EntStore,
	sess *http.SessionManager,
	user *EntStore,
) *UserService {
	return &UserService{
		group: group,
		sess:  sess,
		user:  user,
	}
}

func (s *UserService) UpdateConfig(ctx context.Context, c *connectgo.Request[user.Config]) (*connectgo.Response[emptypb.Empty], error) {
	id, err := s.sess.GetUserID(ctx)
	if err != nil {
		return nil, err
	}
	u, err := s.user.GetUserByID(ctx, id)
	if err != nil {
		return nil, err
	}
	u.Data.User.Config = c.Msg
	err = s.user.UpdateUser(ctx, id, u.Data.User)
	if err != nil {
		return nil, err
	}
	return connectgo.NewResponse(&emptypb.Empty{}), err
}

func (s *UserService) Register(ctx context.Context, c *connectgo.Request[user.User]) (*connectgo.Response[user.User], error) {
	_, err := s.user.AttemptLogin(ctx, c.Msg.Email, c.Msg.Password)
	if err == nil {
		return nil, errors.New("user already exists")
	}
	u, err := s.user.NewUser(ctx, c.Msg, false)
	if err != nil {
		return nil, errors.Wrapf(err, "could not create user")
	}
	s.sess.SetUserID(ctx, u.ID.String())
	return connectgo.NewResponse(&user.User{
		Email: u.Email,
	}), nil
}

func (s *UserService) Login(ctx context.Context, c *connectgo.Request[user.User]) (*connectgo.Response[user.User], error) {
	if id, err := s.sess.GetUserID(ctx); err == nil {
		u, err := s.user.GetUserByID(ctx, id)
		if err != nil {
			return nil, err
		}
		return connectgo.NewResponse(&user.User{
			Email:  u.Email,
			Config: u.Data.Config,
		}), nil
	}

	u, err := s.user.AttemptLogin(ctx, c.Msg.Email, c.Msg.Password)
	if err != nil {
		slog.Warn("could not find user", "error", err)
		return connectgo.NewResponse(&user.User{
			Email: "",
		}), nil
	}
	s.sess.SetUserID(ctx, u.ID.String())
	return connectgo.NewResponse(&user.User{
		Email: u.Email,
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

	secret, err := s.group.CreateGroupInvite(ctx, uuid.MustParse(c.Msg.GroupId))
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
	gID, err := s.group.ValidGroupInvite(ctx, c.Msg.Secret)
	if err != nil {
		return nil, errors.New("invalid group invite")
	}
	err = s.user.JoinGroup(ctx, id, gID)
	if err != nil {
		return nil, err
	}
	return connectgo.NewResponse(&user.Group{
		Id: gID.String(),
	}), nil
}

func (s *UserService) GroupInfo(ctx context.Context, c *connectgo.Request[user.GroupInfoRequest]) (*connectgo.Response[user.Group], error) {
	gID, err := s.group.ValidGroupInvite(ctx, c.Msg.Secret)
	if err != nil {
		return nil, errors.New("invalid group invite")
	}
	g, err := s.group.GetGroupByID(ctx, gID)
	if err != nil {
		return nil, err
	}
	return connectgo.NewResponse(&user.Group{
		Id:   gID.String(),
		Name: g.Name,
	}), nil
}

func (s *UserService) CreateGroup(ctx context.Context, c *connectgo.Request[user.Group]) (*connectgo.Response[user.Group], error) {
	id, err := s.sess.GetUserID(ctx)
	if err != nil {
		return nil, err
	}
	gID, err := s.group.CreateGroup(ctx, id, c.Msg)
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
	groups, err := s.user.GetGroups(ctx, id)
	if err != nil {
		return nil, err
	}
	var groupsProto []*user.Group
	for _, g := range groups {
		if g.Edges.Group == nil {
			slog.Warn("group is nil", "group", g)
			continue
		}
		groupsProto = append(groupsProto, &user.Group{
			Id:    g.Edges.Group.ID.String(),
			Name:  g.Edges.Group.Data.Name,
			Users: g.Edges.Group.Data.Users,
		})
	}
	return connectgo.NewResponse(&user.Groups{
		Groups: groupsProto,
	}), nil
}

func (s *UserService) DeleteGroup(ctx context.Context, c *connectgo.Request[user.Group]) (*connectgo.Response[emptypb.Empty], error) {
	role, err := s.userGroupRole(ctx, c.Msg.Id)
	if err != nil {
		return nil, err
	}
	if role != "admin" {
		return nil, errors.New("user is not an admin of this group")
	}
	err = s.group.DeleteGroup(ctx, uuid.MustParse(c.Msg.Id))
	return connectgo.NewResponse(&emptypb.Empty{}), err
}

func (s *UserService) userGroupRole(ctx context.Context, groupID string) (string, error) {
	id, err := s.sess.GetUserID(ctx)
	if err != nil {
		return "", err
	}
	groups, err := s.user.GetGroups(ctx, id)
	if err != nil {
		return "", err
	}

	for _, g := range groups {
		if g.Edges.Group.ID.String() == groupID {
			return g.Role, nil
		}
	}
	return "", errors.Errorf("user %s is not a member of this group: %s", id, groupID)
}

func (s *UserService) Share(ctx context.Context, c *connectgo.Request[user.ShareRequest]) (*connectgo.Response[emptypb.Empty], error) {
	role, err := s.userGroupRole(ctx, c.Msg.GroupId)
	if err != nil {
		return nil, err
	}
	if role == "" {
		return nil, errors.New("user does not have valid role")
	}
	contentID, err := uuid.Parse(c.Msg.ContentId)
	if err != nil {
		return nil, err
	}
	groupID, err := uuid.Parse(c.Msg.GroupId)
	if err != nil {
		return nil, err
	}
	err = s.group.ShareContent(ctx, contentID, groupID)
	if err != nil {
		return nil, err
	}
	return connectgo.NewResponse(&emptypb.Empty{}), nil
}
