// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             (unknown)
// source: content/content.proto

package content

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// ContentServiceClient is the client API for ContentService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type ContentServiceClient interface {
	Save(ctx context.Context, in *Contents, opts ...grpc.CallOption) (*ContentIDs, error)
	Search(ctx context.Context, in *Query, opts ...grpc.CallOption) (*Results, error)
	Analyze(ctx context.Context, in *Content, opts ...grpc.CallOption) (*Contents, error)
	Delete(ctx context.Context, in *ContentIDs, opts ...grpc.CallOption) (*ContentIDs, error)
	GetTags(ctx context.Context, in *TagRequest, opts ...grpc.CallOption) (*Tags, error)
	Vote(ctx context.Context, in *VoteRequest, opts ...grpc.CallOption) (*VoteResponse, error)
}

type contentServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewContentServiceClient(cc grpc.ClientConnInterface) ContentServiceClient {
	return &contentServiceClient{cc}
}

func (c *contentServiceClient) Save(ctx context.Context, in *Contents, opts ...grpc.CallOption) (*ContentIDs, error) {
	out := new(ContentIDs)
	err := c.cc.Invoke(ctx, "/content.ContentService/Save", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *contentServiceClient) Search(ctx context.Context, in *Query, opts ...grpc.CallOption) (*Results, error) {
	out := new(Results)
	err := c.cc.Invoke(ctx, "/content.ContentService/Search", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *contentServiceClient) Analyze(ctx context.Context, in *Content, opts ...grpc.CallOption) (*Contents, error) {
	out := new(Contents)
	err := c.cc.Invoke(ctx, "/content.ContentService/Analyze", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *contentServiceClient) Delete(ctx context.Context, in *ContentIDs, opts ...grpc.CallOption) (*ContentIDs, error) {
	out := new(ContentIDs)
	err := c.cc.Invoke(ctx, "/content.ContentService/Delete", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *contentServiceClient) GetTags(ctx context.Context, in *TagRequest, opts ...grpc.CallOption) (*Tags, error) {
	out := new(Tags)
	err := c.cc.Invoke(ctx, "/content.ContentService/GetTags", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *contentServiceClient) Vote(ctx context.Context, in *VoteRequest, opts ...grpc.CallOption) (*VoteResponse, error) {
	out := new(VoteResponse)
	err := c.cc.Invoke(ctx, "/content.ContentService/Vote", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// ContentServiceServer is the server API for ContentService service.
// All implementations should embed UnimplementedContentServiceServer
// for forward compatibility
type ContentServiceServer interface {
	Save(context.Context, *Contents) (*ContentIDs, error)
	Search(context.Context, *Query) (*Results, error)
	Analyze(context.Context, *Content) (*Contents, error)
	Delete(context.Context, *ContentIDs) (*ContentIDs, error)
	GetTags(context.Context, *TagRequest) (*Tags, error)
	Vote(context.Context, *VoteRequest) (*VoteResponse, error)
}

// UnimplementedContentServiceServer should be embedded to have forward compatible implementations.
type UnimplementedContentServiceServer struct {
}

func (UnimplementedContentServiceServer) Save(context.Context, *Contents) (*ContentIDs, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Save not implemented")
}
func (UnimplementedContentServiceServer) Search(context.Context, *Query) (*Results, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Search not implemented")
}
func (UnimplementedContentServiceServer) Analyze(context.Context, *Content) (*Contents, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Analyze not implemented")
}
func (UnimplementedContentServiceServer) Delete(context.Context, *ContentIDs) (*ContentIDs, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Delete not implemented")
}
func (UnimplementedContentServiceServer) GetTags(context.Context, *TagRequest) (*Tags, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetTags not implemented")
}
func (UnimplementedContentServiceServer) Vote(context.Context, *VoteRequest) (*VoteResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method Vote not implemented")
}

// UnsafeContentServiceServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to ContentServiceServer will
// result in compilation errors.
type UnsafeContentServiceServer interface {
	mustEmbedUnimplementedContentServiceServer()
}

func RegisterContentServiceServer(s grpc.ServiceRegistrar, srv ContentServiceServer) {
	s.RegisterService(&ContentService_ServiceDesc, srv)
}

func _ContentService_Save_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Contents)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ContentServiceServer).Save(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/content.ContentService/Save",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ContentServiceServer).Save(ctx, req.(*Contents))
	}
	return interceptor(ctx, in, info, handler)
}

func _ContentService_Search_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Query)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ContentServiceServer).Search(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/content.ContentService/Search",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ContentServiceServer).Search(ctx, req.(*Query))
	}
	return interceptor(ctx, in, info, handler)
}

func _ContentService_Analyze_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(Content)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ContentServiceServer).Analyze(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/content.ContentService/Analyze",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ContentServiceServer).Analyze(ctx, req.(*Content))
	}
	return interceptor(ctx, in, info, handler)
}

func _ContentService_Delete_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ContentIDs)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ContentServiceServer).Delete(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/content.ContentService/Delete",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ContentServiceServer).Delete(ctx, req.(*ContentIDs))
	}
	return interceptor(ctx, in, info, handler)
}

func _ContentService_GetTags_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(TagRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ContentServiceServer).GetTags(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/content.ContentService/GetTags",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ContentServiceServer).GetTags(ctx, req.(*TagRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _ContentService_Vote_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(VoteRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(ContentServiceServer).Vote(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/content.ContentService/Vote",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(ContentServiceServer).Vote(ctx, req.(*VoteRequest))
	}
	return interceptor(ctx, in, info, handler)
}

// ContentService_ServiceDesc is the grpc.ServiceDesc for ContentService service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var ContentService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "content.ContentService",
	HandlerType: (*ContentServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "Save",
			Handler:    _ContentService_Save_Handler,
		},
		{
			MethodName: "Search",
			Handler:    _ContentService_Search_Handler,
		},
		{
			MethodName: "Analyze",
			Handler:    _ContentService_Analyze_Handler,
		},
		{
			MethodName: "Delete",
			Handler:    _ContentService_Delete_Handler,
		},
		{
			MethodName: "GetTags",
			Handler:    _ContentService_GetTags_Handler,
		},
		{
			MethodName: "Vote",
			Handler:    _ContentService_Vote_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "content/content.proto",
}
