package user

import (
	"context"
	"fmt"
	connectgo "github.com/bufbuild/connect-go"
	"github.com/google/uuid"
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/user"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/user/userconnect"
	"github.com/lunabrain-ai/lunabrain/pkg/group"
	"github.com/lunabrain-ai/lunabrain/pkg/http"
	"github.com/markbates/goth"
	"github.com/pkg/errors"
	"google.golang.org/protobuf/types/known/emptypb"
	"log/slog"
	"net/smtp"
	"net/url"
	"strings"
)

type Service struct {
	sess   *http.SessionManager
	user   *EntStore
	group  *group.EntStore
	config Config
}

var _ userconnect.UserServiceHandler = (*Service)(nil)

var ProviderSet = wire.NewSet(
	NewConfig,
	NewService,
	NewEntStore,
)

func NewService(
	group *group.EntStore,
	sess *http.SessionManager,
	user *EntStore,
	config Config,
) *Service {
	return &Service{
		group:  group,
		sess:   sess,
		user:   user,
		config: config,
	}
}

func (s *Service) UpdateConfig(ctx context.Context, c *connectgo.Request[user.Config]) (*connectgo.Response[emptypb.Empty], error) {
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

func (s *Service) ResetPassword(ctx context.Context, c *connectgo.Request[user.User]) (*connectgo.Response[emptypb.Empty], error) {
	id, err := s.sess.GetUserID(ctx)
	if err != nil {
		return nil, err
	}
	err = s.user.ResetPassword(ctx, id, c.Msg.Password)
	if err != nil {
		return nil, err
	}
	return connectgo.NewResponse(&emptypb.Empty{}), err
}

func (s *Service) sendVerificationEmail(
	ctx context.Context, from string, to []string, subject string, body string) error {
	smtpHost := s.config.SmtpHost
	smtpPort := s.config.SmtpPort
	auth := smtp.PlainAuth("", s.config.SmtpUsername, s.config.SmtpPassword, smtpHost)
	message := []byte("To: " + strings.Join(to, ",") + "\r\n" +
		"Subject: " + subject + "\r\n" +
		"\r\n" +
		body + "\r\n")

	// Connect to the SMTP server, authenticate, and send the email
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, message)
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}
	return nil
}

func (s *Service) ConnectOAuthUser(ctx context.Context, u goth.User) error {
	nu, err := s.user.GetUserByEmail(ctx, u.Email)
	if err != nil {
		nu, err = s.user.NewUser(ctx, &user.User{
			Email: u.Email,
		}, u)
	}
	s.sess.SetUserID(ctx, nu.ID.String())
	return nil
}

func (s *Service) Register(ctx context.Context, c *connectgo.Request[user.User]) (*connectgo.Response[user.User], error) {
	if s.config.RegistrationAllowed != "true" {
		return nil, errors.New("registration is not allowed")
	}
	_, err := s.user.AttemptLogin(ctx, c.Msg.Email, c.Msg.Password)
	if err == nil {
		return nil, errors.New("user already exists")
	}
	u, err := s.user.NewUser(ctx, c.Msg, goth.User{})
	if err != nil {
		return nil, errors.Wrapf(err, "could not create user")
	}
	s.sess.SetUserID(ctx, u.ID.String())
	if s.config.EmailVerification == "true" {
		secret, err := s.user.NewUserVerifySecret(ctx, u)
		if err != nil {
			return nil, errors.Wrapf(err, "could not create email verification secret")
		}

		from := s.config.SmtpUsername
		to := []string{u.Email}
		v := url.Values{
			"secret": []string{secret.String()},
		}
		verifyURL := url.URL{
			Scheme:   "https",
			Host:     "breadchris.ngrok.io",
			Path:     "/verify",
			RawQuery: v.Encode(),
		}
		err = s.sendVerificationEmail(ctx, from, to, "auth", verifyURL.String())
		if err != nil {
			return nil, errors.Wrapf(err, "could not send verification email")
		}
	}
	return connectgo.NewResponse(&user.User{
		Email: u.Email,
	}), nil
}

func (s *Service) VerifyUser(ctx context.Context, c *connectgo.Request[user.VerifyUserRequest]) (*connectgo.Response[emptypb.Empty], error) {
	secret, err := uuid.Parse(c.Msg.Secret)
	if err != nil {
		return nil, errors.Wrapf(err, "could not parse secret")
	}
	err = s.user.VerifyUser(ctx, secret)
	if err != nil {
		return nil, errors.Wrapf(err, "could not verify user")
	}
	return connectgo.NewResponse(&emptypb.Empty{}), nil
}

func (s *Service) Login(ctx context.Context, c *connectgo.Request[user.User]) (*connectgo.Response[user.User], error) {
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

func (s *Service) Logout(ctx context.Context, c *connectgo.Request[emptypb.Empty]) (*connectgo.Response[emptypb.Empty], error) {
	s.sess.ClearUserID(ctx)
	return connectgo.NewResponse(&emptypb.Empty{}), nil
}

func (s *Service) CreateGroupInvite(ctx context.Context, c *connectgo.Request[user.GroupID]) (*connectgo.Response[user.GroupInvite], error) {
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

func (s *Service) JoinGroup(ctx context.Context, c *connectgo.Request[user.GroupInvite]) (*connectgo.Response[user.Group], error) {
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

func (s *Service) GroupInfo(ctx context.Context, c *connectgo.Request[user.GroupInfoRequest]) (*connectgo.Response[user.Group], error) {
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

func (s *Service) CreateGroup(ctx context.Context, c *connectgo.Request[user.Group]) (*connectgo.Response[user.Group], error) {
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

func (s *Service) GetGroups(ctx context.Context, c *connectgo.Request[emptypb.Empty]) (*connectgo.Response[user.Groups], error) {
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

func (s *Service) DeleteGroup(ctx context.Context, c *connectgo.Request[user.Group]) (*connectgo.Response[emptypb.Empty], error) {
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

func (s *Service) userGroupRole(ctx context.Context, groupID string) (string, error) {
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

func (s *Service) Share(ctx context.Context, c *connectgo.Request[user.ShareRequest]) (*connectgo.Response[emptypb.Empty], error) {
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
