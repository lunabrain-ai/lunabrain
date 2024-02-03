// Code generated by protoc-gen-connect-go. DO NOT EDIT.
//
// Source: user/user.proto

package userconnect

import (
	context "context"
	errors "errors"
	connect_go "github.com/bufbuild/connect-go"
	user "github.com/lunabrain-ai/lunabrain/pkg/gen/user"
	emptypb "google.golang.org/protobuf/types/known/emptypb"
	http "net/http"
	strings "strings"
)

// This is a compile-time assertion to ensure that this generated file and the connect package are
// compatible. If you get a compiler error that this constant is not defined, this code was
// generated with a version of connect newer than the one compiled into your binary. You can fix the
// problem by either regenerating this code with an older version of connect or updating the connect
// version compiled into your binary.
const _ = connect_go.IsAtLeastVersion0_1_0

const (
	// UserServiceName is the fully-qualified name of the UserService service.
	UserServiceName = "user.UserService"
)

// These constants are the fully-qualified names of the RPCs defined in this package. They're
// exposed at runtime as Spec.Procedure and as the final two segments of the HTTP route.
//
// Note that these are different from the fully-qualified method names used by
// google.golang.org/protobuf/reflect/protoreflect. To convert from these constants to
// reflection-formatted method names, remove the leading slash and convert the remaining slash to a
// period.
const (
	// UserServiceRegisterProcedure is the fully-qualified name of the UserService's Register RPC.
	UserServiceRegisterProcedure = "/user.UserService/Register"
	// UserServiceLoginProcedure is the fully-qualified name of the UserService's Login RPC.
	UserServiceLoginProcedure = "/user.UserService/Login"
	// UserServiceLogoutProcedure is the fully-qualified name of the UserService's Logout RPC.
	UserServiceLogoutProcedure = "/user.UserService/Logout"
	// UserServiceResetPasswordProcedure is the fully-qualified name of the UserService's ResetPassword
	// RPC.
	UserServiceResetPasswordProcedure = "/user.UserService/ResetPassword"
	// UserServiceVerifyUserProcedure is the fully-qualified name of the UserService's VerifyUser RPC.
	UserServiceVerifyUserProcedure = "/user.UserService/VerifyUser"
	// UserServiceUpdateConfigProcedure is the fully-qualified name of the UserService's UpdateConfig
	// RPC.
	UserServiceUpdateConfigProcedure = "/user.UserService/UpdateConfig"
	// UserServiceCreateGroupInviteProcedure is the fully-qualified name of the UserService's
	// CreateGroupInvite RPC.
	UserServiceCreateGroupInviteProcedure = "/user.UserService/CreateGroupInvite"
	// UserServiceJoinGroupProcedure is the fully-qualified name of the UserService's JoinGroup RPC.
	UserServiceJoinGroupProcedure = "/user.UserService/JoinGroup"
	// UserServiceGroupInfoProcedure is the fully-qualified name of the UserService's GroupInfo RPC.
	UserServiceGroupInfoProcedure = "/user.UserService/GroupInfo"
	// UserServiceCreateGroupProcedure is the fully-qualified name of the UserService's CreateGroup RPC.
	UserServiceCreateGroupProcedure = "/user.UserService/CreateGroup"
	// UserServiceGetGroupsProcedure is the fully-qualified name of the UserService's GetGroups RPC.
	UserServiceGetGroupsProcedure = "/user.UserService/GetGroups"
	// UserServiceDeleteGroupProcedure is the fully-qualified name of the UserService's DeleteGroup RPC.
	UserServiceDeleteGroupProcedure = "/user.UserService/DeleteGroup"
	// UserServiceShareProcedure is the fully-qualified name of the UserService's Share RPC.
	UserServiceShareProcedure = "/user.UserService/Share"
)

// UserServiceClient is a client for the user.UserService service.
type UserServiceClient interface {
	Register(context.Context, *connect_go.Request[user.User]) (*connect_go.Response[user.User], error)
	Login(context.Context, *connect_go.Request[user.User]) (*connect_go.Response[user.LoginResponse], error)
	Logout(context.Context, *connect_go.Request[emptypb.Empty]) (*connect_go.Response[emptypb.Empty], error)
	ResetPassword(context.Context, *connect_go.Request[user.User]) (*connect_go.Response[emptypb.Empty], error)
	VerifyUser(context.Context, *connect_go.Request[user.VerifyUserRequest]) (*connect_go.Response[emptypb.Empty], error)
	UpdateConfig(context.Context, *connect_go.Request[user.Config]) (*connect_go.Response[emptypb.Empty], error)
	CreateGroupInvite(context.Context, *connect_go.Request[user.GroupID]) (*connect_go.Response[user.GroupInvite], error)
	JoinGroup(context.Context, *connect_go.Request[user.GroupInvite]) (*connect_go.Response[user.Group], error)
	GroupInfo(context.Context, *connect_go.Request[user.GroupInfoRequest]) (*connect_go.Response[user.Group], error)
	CreateGroup(context.Context, *connect_go.Request[user.Group]) (*connect_go.Response[user.Group], error)
	GetGroups(context.Context, *connect_go.Request[emptypb.Empty]) (*connect_go.Response[user.Groups], error)
	DeleteGroup(context.Context, *connect_go.Request[user.Group]) (*connect_go.Response[emptypb.Empty], error)
	Share(context.Context, *connect_go.Request[user.ShareRequest]) (*connect_go.Response[emptypb.Empty], error)
}

// NewUserServiceClient constructs a client for the user.UserService service. By default, it uses
// the Connect protocol with the binary Protobuf Codec, asks for gzipped responses, and sends
// uncompressed requests. To use the gRPC or gRPC-Web protocols, supply the connect.WithGRPC() or
// connect.WithGRPCWeb() options.
//
// The URL supplied here should be the base URL for the Connect or gRPC server (for example,
// http://api.acme.com or https://acme.com/grpc).
func NewUserServiceClient(httpClient connect_go.HTTPClient, baseURL string, opts ...connect_go.ClientOption) UserServiceClient {
	baseURL = strings.TrimRight(baseURL, "/")
	return &userServiceClient{
		register: connect_go.NewClient[user.User, user.User](
			httpClient,
			baseURL+UserServiceRegisterProcedure,
			opts...,
		),
		login: connect_go.NewClient[user.User, user.LoginResponse](
			httpClient,
			baseURL+UserServiceLoginProcedure,
			opts...,
		),
		logout: connect_go.NewClient[emptypb.Empty, emptypb.Empty](
			httpClient,
			baseURL+UserServiceLogoutProcedure,
			opts...,
		),
		resetPassword: connect_go.NewClient[user.User, emptypb.Empty](
			httpClient,
			baseURL+UserServiceResetPasswordProcedure,
			opts...,
		),
		verifyUser: connect_go.NewClient[user.VerifyUserRequest, emptypb.Empty](
			httpClient,
			baseURL+UserServiceVerifyUserProcedure,
			opts...,
		),
		updateConfig: connect_go.NewClient[user.Config, emptypb.Empty](
			httpClient,
			baseURL+UserServiceUpdateConfigProcedure,
			opts...,
		),
		createGroupInvite: connect_go.NewClient[user.GroupID, user.GroupInvite](
			httpClient,
			baseURL+UserServiceCreateGroupInviteProcedure,
			opts...,
		),
		joinGroup: connect_go.NewClient[user.GroupInvite, user.Group](
			httpClient,
			baseURL+UserServiceJoinGroupProcedure,
			opts...,
		),
		groupInfo: connect_go.NewClient[user.GroupInfoRequest, user.Group](
			httpClient,
			baseURL+UserServiceGroupInfoProcedure,
			opts...,
		),
		createGroup: connect_go.NewClient[user.Group, user.Group](
			httpClient,
			baseURL+UserServiceCreateGroupProcedure,
			opts...,
		),
		getGroups: connect_go.NewClient[emptypb.Empty, user.Groups](
			httpClient,
			baseURL+UserServiceGetGroupsProcedure,
			opts...,
		),
		deleteGroup: connect_go.NewClient[user.Group, emptypb.Empty](
			httpClient,
			baseURL+UserServiceDeleteGroupProcedure,
			opts...,
		),
		share: connect_go.NewClient[user.ShareRequest, emptypb.Empty](
			httpClient,
			baseURL+UserServiceShareProcedure,
			opts...,
		),
	}
}

// userServiceClient implements UserServiceClient.
type userServiceClient struct {
	register          *connect_go.Client[user.User, user.User]
	login             *connect_go.Client[user.User, user.LoginResponse]
	logout            *connect_go.Client[emptypb.Empty, emptypb.Empty]
	resetPassword     *connect_go.Client[user.User, emptypb.Empty]
	verifyUser        *connect_go.Client[user.VerifyUserRequest, emptypb.Empty]
	updateConfig      *connect_go.Client[user.Config, emptypb.Empty]
	createGroupInvite *connect_go.Client[user.GroupID, user.GroupInvite]
	joinGroup         *connect_go.Client[user.GroupInvite, user.Group]
	groupInfo         *connect_go.Client[user.GroupInfoRequest, user.Group]
	createGroup       *connect_go.Client[user.Group, user.Group]
	getGroups         *connect_go.Client[emptypb.Empty, user.Groups]
	deleteGroup       *connect_go.Client[user.Group, emptypb.Empty]
	share             *connect_go.Client[user.ShareRequest, emptypb.Empty]
}

// Register calls user.UserService.Register.
func (c *userServiceClient) Register(ctx context.Context, req *connect_go.Request[user.User]) (*connect_go.Response[user.User], error) {
	return c.register.CallUnary(ctx, req)
}

// Login calls user.UserService.Login.
func (c *userServiceClient) Login(ctx context.Context, req *connect_go.Request[user.User]) (*connect_go.Response[user.LoginResponse], error) {
	return c.login.CallUnary(ctx, req)
}

// Logout calls user.UserService.Logout.
func (c *userServiceClient) Logout(ctx context.Context, req *connect_go.Request[emptypb.Empty]) (*connect_go.Response[emptypb.Empty], error) {
	return c.logout.CallUnary(ctx, req)
}

// ResetPassword calls user.UserService.ResetPassword.
func (c *userServiceClient) ResetPassword(ctx context.Context, req *connect_go.Request[user.User]) (*connect_go.Response[emptypb.Empty], error) {
	return c.resetPassword.CallUnary(ctx, req)
}

// VerifyUser calls user.UserService.VerifyUser.
func (c *userServiceClient) VerifyUser(ctx context.Context, req *connect_go.Request[user.VerifyUserRequest]) (*connect_go.Response[emptypb.Empty], error) {
	return c.verifyUser.CallUnary(ctx, req)
}

// UpdateConfig calls user.UserService.UpdateConfig.
func (c *userServiceClient) UpdateConfig(ctx context.Context, req *connect_go.Request[user.Config]) (*connect_go.Response[emptypb.Empty], error) {
	return c.updateConfig.CallUnary(ctx, req)
}

// CreateGroupInvite calls user.UserService.CreateGroupInvite.
func (c *userServiceClient) CreateGroupInvite(ctx context.Context, req *connect_go.Request[user.GroupID]) (*connect_go.Response[user.GroupInvite], error) {
	return c.createGroupInvite.CallUnary(ctx, req)
}

// JoinGroup calls user.UserService.JoinGroup.
func (c *userServiceClient) JoinGroup(ctx context.Context, req *connect_go.Request[user.GroupInvite]) (*connect_go.Response[user.Group], error) {
	return c.joinGroup.CallUnary(ctx, req)
}

// GroupInfo calls user.UserService.GroupInfo.
func (c *userServiceClient) GroupInfo(ctx context.Context, req *connect_go.Request[user.GroupInfoRequest]) (*connect_go.Response[user.Group], error) {
	return c.groupInfo.CallUnary(ctx, req)
}

// CreateGroup calls user.UserService.CreateGroup.
func (c *userServiceClient) CreateGroup(ctx context.Context, req *connect_go.Request[user.Group]) (*connect_go.Response[user.Group], error) {
	return c.createGroup.CallUnary(ctx, req)
}

// GetGroups calls user.UserService.GetGroups.
func (c *userServiceClient) GetGroups(ctx context.Context, req *connect_go.Request[emptypb.Empty]) (*connect_go.Response[user.Groups], error) {
	return c.getGroups.CallUnary(ctx, req)
}

// DeleteGroup calls user.UserService.DeleteGroup.
func (c *userServiceClient) DeleteGroup(ctx context.Context, req *connect_go.Request[user.Group]) (*connect_go.Response[emptypb.Empty], error) {
	return c.deleteGroup.CallUnary(ctx, req)
}

// Share calls user.UserService.Share.
func (c *userServiceClient) Share(ctx context.Context, req *connect_go.Request[user.ShareRequest]) (*connect_go.Response[emptypb.Empty], error) {
	return c.share.CallUnary(ctx, req)
}

// UserServiceHandler is an implementation of the user.UserService service.
type UserServiceHandler interface {
	Register(context.Context, *connect_go.Request[user.User]) (*connect_go.Response[user.User], error)
	Login(context.Context, *connect_go.Request[user.User]) (*connect_go.Response[user.LoginResponse], error)
	Logout(context.Context, *connect_go.Request[emptypb.Empty]) (*connect_go.Response[emptypb.Empty], error)
	ResetPassword(context.Context, *connect_go.Request[user.User]) (*connect_go.Response[emptypb.Empty], error)
	VerifyUser(context.Context, *connect_go.Request[user.VerifyUserRequest]) (*connect_go.Response[emptypb.Empty], error)
	UpdateConfig(context.Context, *connect_go.Request[user.Config]) (*connect_go.Response[emptypb.Empty], error)
	CreateGroupInvite(context.Context, *connect_go.Request[user.GroupID]) (*connect_go.Response[user.GroupInvite], error)
	JoinGroup(context.Context, *connect_go.Request[user.GroupInvite]) (*connect_go.Response[user.Group], error)
	GroupInfo(context.Context, *connect_go.Request[user.GroupInfoRequest]) (*connect_go.Response[user.Group], error)
	CreateGroup(context.Context, *connect_go.Request[user.Group]) (*connect_go.Response[user.Group], error)
	GetGroups(context.Context, *connect_go.Request[emptypb.Empty]) (*connect_go.Response[user.Groups], error)
	DeleteGroup(context.Context, *connect_go.Request[user.Group]) (*connect_go.Response[emptypb.Empty], error)
	Share(context.Context, *connect_go.Request[user.ShareRequest]) (*connect_go.Response[emptypb.Empty], error)
}

// NewUserServiceHandler builds an HTTP handler from the service implementation. It returns the path
// on which to mount the handler and the handler itself.
//
// By default, handlers support the Connect, gRPC, and gRPC-Web protocols with the binary Protobuf
// and JSON codecs. They also support gzip compression.
func NewUserServiceHandler(svc UserServiceHandler, opts ...connect_go.HandlerOption) (string, http.Handler) {
	userServiceRegisterHandler := connect_go.NewUnaryHandler(
		UserServiceRegisterProcedure,
		svc.Register,
		opts...,
	)
	userServiceLoginHandler := connect_go.NewUnaryHandler(
		UserServiceLoginProcedure,
		svc.Login,
		opts...,
	)
	userServiceLogoutHandler := connect_go.NewUnaryHandler(
		UserServiceLogoutProcedure,
		svc.Logout,
		opts...,
	)
	userServiceResetPasswordHandler := connect_go.NewUnaryHandler(
		UserServiceResetPasswordProcedure,
		svc.ResetPassword,
		opts...,
	)
	userServiceVerifyUserHandler := connect_go.NewUnaryHandler(
		UserServiceVerifyUserProcedure,
		svc.VerifyUser,
		opts...,
	)
	userServiceUpdateConfigHandler := connect_go.NewUnaryHandler(
		UserServiceUpdateConfigProcedure,
		svc.UpdateConfig,
		opts...,
	)
	userServiceCreateGroupInviteHandler := connect_go.NewUnaryHandler(
		UserServiceCreateGroupInviteProcedure,
		svc.CreateGroupInvite,
		opts...,
	)
	userServiceJoinGroupHandler := connect_go.NewUnaryHandler(
		UserServiceJoinGroupProcedure,
		svc.JoinGroup,
		opts...,
	)
	userServiceGroupInfoHandler := connect_go.NewUnaryHandler(
		UserServiceGroupInfoProcedure,
		svc.GroupInfo,
		opts...,
	)
	userServiceCreateGroupHandler := connect_go.NewUnaryHandler(
		UserServiceCreateGroupProcedure,
		svc.CreateGroup,
		opts...,
	)
	userServiceGetGroupsHandler := connect_go.NewUnaryHandler(
		UserServiceGetGroupsProcedure,
		svc.GetGroups,
		opts...,
	)
	userServiceDeleteGroupHandler := connect_go.NewUnaryHandler(
		UserServiceDeleteGroupProcedure,
		svc.DeleteGroup,
		opts...,
	)
	userServiceShareHandler := connect_go.NewUnaryHandler(
		UserServiceShareProcedure,
		svc.Share,
		opts...,
	)
	return "/user.UserService/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case UserServiceRegisterProcedure:
			userServiceRegisterHandler.ServeHTTP(w, r)
		case UserServiceLoginProcedure:
			userServiceLoginHandler.ServeHTTP(w, r)
		case UserServiceLogoutProcedure:
			userServiceLogoutHandler.ServeHTTP(w, r)
		case UserServiceResetPasswordProcedure:
			userServiceResetPasswordHandler.ServeHTTP(w, r)
		case UserServiceVerifyUserProcedure:
			userServiceVerifyUserHandler.ServeHTTP(w, r)
		case UserServiceUpdateConfigProcedure:
			userServiceUpdateConfigHandler.ServeHTTP(w, r)
		case UserServiceCreateGroupInviteProcedure:
			userServiceCreateGroupInviteHandler.ServeHTTP(w, r)
		case UserServiceJoinGroupProcedure:
			userServiceJoinGroupHandler.ServeHTTP(w, r)
		case UserServiceGroupInfoProcedure:
			userServiceGroupInfoHandler.ServeHTTP(w, r)
		case UserServiceCreateGroupProcedure:
			userServiceCreateGroupHandler.ServeHTTP(w, r)
		case UserServiceGetGroupsProcedure:
			userServiceGetGroupsHandler.ServeHTTP(w, r)
		case UserServiceDeleteGroupProcedure:
			userServiceDeleteGroupHandler.ServeHTTP(w, r)
		case UserServiceShareProcedure:
			userServiceShareHandler.ServeHTTP(w, r)
		default:
			http.NotFound(w, r)
		}
	})
}

// UnimplementedUserServiceHandler returns CodeUnimplemented from all methods.
type UnimplementedUserServiceHandler struct{}

func (UnimplementedUserServiceHandler) Register(context.Context, *connect_go.Request[user.User]) (*connect_go.Response[user.User], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("user.UserService.Register is not implemented"))
}

func (UnimplementedUserServiceHandler) Login(context.Context, *connect_go.Request[user.User]) (*connect_go.Response[user.LoginResponse], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("user.UserService.Login is not implemented"))
}

func (UnimplementedUserServiceHandler) Logout(context.Context, *connect_go.Request[emptypb.Empty]) (*connect_go.Response[emptypb.Empty], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("user.UserService.Logout is not implemented"))
}

func (UnimplementedUserServiceHandler) ResetPassword(context.Context, *connect_go.Request[user.User]) (*connect_go.Response[emptypb.Empty], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("user.UserService.ResetPassword is not implemented"))
}

func (UnimplementedUserServiceHandler) VerifyUser(context.Context, *connect_go.Request[user.VerifyUserRequest]) (*connect_go.Response[emptypb.Empty], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("user.UserService.VerifyUser is not implemented"))
}

func (UnimplementedUserServiceHandler) UpdateConfig(context.Context, *connect_go.Request[user.Config]) (*connect_go.Response[emptypb.Empty], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("user.UserService.UpdateConfig is not implemented"))
}

func (UnimplementedUserServiceHandler) CreateGroupInvite(context.Context, *connect_go.Request[user.GroupID]) (*connect_go.Response[user.GroupInvite], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("user.UserService.CreateGroupInvite is not implemented"))
}

func (UnimplementedUserServiceHandler) JoinGroup(context.Context, *connect_go.Request[user.GroupInvite]) (*connect_go.Response[user.Group], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("user.UserService.JoinGroup is not implemented"))
}

func (UnimplementedUserServiceHandler) GroupInfo(context.Context, *connect_go.Request[user.GroupInfoRequest]) (*connect_go.Response[user.Group], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("user.UserService.GroupInfo is not implemented"))
}

func (UnimplementedUserServiceHandler) CreateGroup(context.Context, *connect_go.Request[user.Group]) (*connect_go.Response[user.Group], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("user.UserService.CreateGroup is not implemented"))
}

func (UnimplementedUserServiceHandler) GetGroups(context.Context, *connect_go.Request[emptypb.Empty]) (*connect_go.Response[user.Groups], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("user.UserService.GetGroups is not implemented"))
}

func (UnimplementedUserServiceHandler) DeleteGroup(context.Context, *connect_go.Request[user.Group]) (*connect_go.Response[emptypb.Empty], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("user.UserService.DeleteGroup is not implemented"))
}

func (UnimplementedUserServiceHandler) Share(context.Context, *connect_go.Request[user.ShareRequest]) (*connect_go.Response[emptypb.Empty], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("user.UserService.Share is not implemented"))
}