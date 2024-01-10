// Code generated by protoc-gen-connect-go. DO NOT EDIT.
//
// Source: content/content.proto

package contentconnect

import (
	context "context"
	errors "errors"
	connect_go "github.com/bufbuild/connect-go"
	content "github.com/lunabrain-ai/lunabrain/pkg/gen/content"
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
	// ContentServiceName is the fully-qualified name of the ContentService service.
	ContentServiceName = "content.ContentService"
)

// These constants are the fully-qualified names of the RPCs defined in this package. They're
// exposed at runtime as Spec.Procedure and as the final two segments of the HTTP route.
//
// Note that these are different from the fully-qualified method names used by
// google.golang.org/protobuf/reflect/protoreflect. To convert from these constants to
// reflection-formatted method names, remove the leading slash and convert the remaining slash to a
// period.
const (
	// ContentServiceSaveProcedure is the fully-qualified name of the ContentService's Save RPC.
	ContentServiceSaveProcedure = "/content.ContentService/Save"
	// ContentServiceSearchProcedure is the fully-qualified name of the ContentService's Search RPC.
	ContentServiceSearchProcedure = "/content.ContentService/Search"
	// ContentServiceAnalyzeProcedure is the fully-qualified name of the ContentService's Analyze RPC.
	ContentServiceAnalyzeProcedure = "/content.ContentService/Analyze"
	// ContentServiceDeleteProcedure is the fully-qualified name of the ContentService's Delete RPC.
	ContentServiceDeleteProcedure = "/content.ContentService/Delete"
	// ContentServiceGetTagsProcedure is the fully-qualified name of the ContentService's GetTags RPC.
	ContentServiceGetTagsProcedure = "/content.ContentService/GetTags"
	// ContentServiceSetTagsProcedure is the fully-qualified name of the ContentService's SetTags RPC.
	ContentServiceSetTagsProcedure = "/content.ContentService/SetTags"
	// ContentServicePublishProcedure is the fully-qualified name of the ContentService's Publish RPC.
	ContentServicePublishProcedure = "/content.ContentService/Publish"
	// ContentServiceGetSourcesProcedure is the fully-qualified name of the ContentService's GetSources
	// RPC.
	ContentServiceGetSourcesProcedure = "/content.ContentService/GetSources"
	// ContentServiceTypesProcedure is the fully-qualified name of the ContentService's Types RPC.
	ContentServiceTypesProcedure = "/content.ContentService/Types"
)

// ContentServiceClient is a client for the content.ContentService service.
type ContentServiceClient interface {
	Save(context.Context, *connect_go.Request[content.Contents]) (*connect_go.Response[content.ContentIDs], error)
	Search(context.Context, *connect_go.Request[content.Query]) (*connect_go.Response[content.Results], error)
	Analyze(context.Context, *connect_go.Request[content.Content]) (*connect_go.Response[content.Contents], error)
	Delete(context.Context, *connect_go.Request[content.ContentIDs]) (*connect_go.Response[content.ContentIDs], error)
	GetTags(context.Context, *connect_go.Request[content.TagRequest]) (*connect_go.Response[content.Tags], error)
	SetTags(context.Context, *connect_go.Request[content.SetTagsRequest]) (*connect_go.Response[emptypb.Empty], error)
	Publish(context.Context, *connect_go.Request[content.ContentIDs]) (*connect_go.Response[content.ContentIDs], error)
	GetSources(context.Context, *connect_go.Request[emptypb.Empty]) (*connect_go.Response[content.Sources], error)
	Types(context.Context, *connect_go.Request[emptypb.Empty]) (*connect_go.Response[content.GRPCTypeInfo], error)
}

// NewContentServiceClient constructs a client for the content.ContentService service. By default,
// it uses the Connect protocol with the binary Protobuf Codec, asks for gzipped responses, and
// sends uncompressed requests. To use the gRPC or gRPC-Web protocols, supply the connect.WithGRPC()
// or connect.WithGRPCWeb() options.
//
// The URL supplied here should be the base URL for the Connect or gRPC server (for example,
// http://api.acme.com or https://acme.com/grpc).
func NewContentServiceClient(httpClient connect_go.HTTPClient, baseURL string, opts ...connect_go.ClientOption) ContentServiceClient {
	baseURL = strings.TrimRight(baseURL, "/")
	return &contentServiceClient{
		save: connect_go.NewClient[content.Contents, content.ContentIDs](
			httpClient,
			baseURL+ContentServiceSaveProcedure,
			opts...,
		),
		search: connect_go.NewClient[content.Query, content.Results](
			httpClient,
			baseURL+ContentServiceSearchProcedure,
			opts...,
		),
		analyze: connect_go.NewClient[content.Content, content.Contents](
			httpClient,
			baseURL+ContentServiceAnalyzeProcedure,
			opts...,
		),
		delete: connect_go.NewClient[content.ContentIDs, content.ContentIDs](
			httpClient,
			baseURL+ContentServiceDeleteProcedure,
			opts...,
		),
		getTags: connect_go.NewClient[content.TagRequest, content.Tags](
			httpClient,
			baseURL+ContentServiceGetTagsProcedure,
			opts...,
		),
		setTags: connect_go.NewClient[content.SetTagsRequest, emptypb.Empty](
			httpClient,
			baseURL+ContentServiceSetTagsProcedure,
			opts...,
		),
		publish: connect_go.NewClient[content.ContentIDs, content.ContentIDs](
			httpClient,
			baseURL+ContentServicePublishProcedure,
			opts...,
		),
		getSources: connect_go.NewClient[emptypb.Empty, content.Sources](
			httpClient,
			baseURL+ContentServiceGetSourcesProcedure,
			opts...,
		),
		types: connect_go.NewClient[emptypb.Empty, content.GRPCTypeInfo](
			httpClient,
			baseURL+ContentServiceTypesProcedure,
			opts...,
		),
	}
}

// contentServiceClient implements ContentServiceClient.
type contentServiceClient struct {
	save       *connect_go.Client[content.Contents, content.ContentIDs]
	search     *connect_go.Client[content.Query, content.Results]
	analyze    *connect_go.Client[content.Content, content.Contents]
	delete     *connect_go.Client[content.ContentIDs, content.ContentIDs]
	getTags    *connect_go.Client[content.TagRequest, content.Tags]
	setTags    *connect_go.Client[content.SetTagsRequest, emptypb.Empty]
	publish    *connect_go.Client[content.ContentIDs, content.ContentIDs]
	getSources *connect_go.Client[emptypb.Empty, content.Sources]
	types      *connect_go.Client[emptypb.Empty, content.GRPCTypeInfo]
}

// Save calls content.ContentService.Save.
func (c *contentServiceClient) Save(ctx context.Context, req *connect_go.Request[content.Contents]) (*connect_go.Response[content.ContentIDs], error) {
	return c.save.CallUnary(ctx, req)
}

// Search calls content.ContentService.Search.
func (c *contentServiceClient) Search(ctx context.Context, req *connect_go.Request[content.Query]) (*connect_go.Response[content.Results], error) {
	return c.search.CallUnary(ctx, req)
}

// Analyze calls content.ContentService.Analyze.
func (c *contentServiceClient) Analyze(ctx context.Context, req *connect_go.Request[content.Content]) (*connect_go.Response[content.Contents], error) {
	return c.analyze.CallUnary(ctx, req)
}

// Delete calls content.ContentService.Delete.
func (c *contentServiceClient) Delete(ctx context.Context, req *connect_go.Request[content.ContentIDs]) (*connect_go.Response[content.ContentIDs], error) {
	return c.delete.CallUnary(ctx, req)
}

// GetTags calls content.ContentService.GetTags.
func (c *contentServiceClient) GetTags(ctx context.Context, req *connect_go.Request[content.TagRequest]) (*connect_go.Response[content.Tags], error) {
	return c.getTags.CallUnary(ctx, req)
}

// SetTags calls content.ContentService.SetTags.
func (c *contentServiceClient) SetTags(ctx context.Context, req *connect_go.Request[content.SetTagsRequest]) (*connect_go.Response[emptypb.Empty], error) {
	return c.setTags.CallUnary(ctx, req)
}

// Publish calls content.ContentService.Publish.
func (c *contentServiceClient) Publish(ctx context.Context, req *connect_go.Request[content.ContentIDs]) (*connect_go.Response[content.ContentIDs], error) {
	return c.publish.CallUnary(ctx, req)
}

// GetSources calls content.ContentService.GetSources.
func (c *contentServiceClient) GetSources(ctx context.Context, req *connect_go.Request[emptypb.Empty]) (*connect_go.Response[content.Sources], error) {
	return c.getSources.CallUnary(ctx, req)
}

// Types calls content.ContentService.Types.
func (c *contentServiceClient) Types(ctx context.Context, req *connect_go.Request[emptypb.Empty]) (*connect_go.Response[content.GRPCTypeInfo], error) {
	return c.types.CallUnary(ctx, req)
}

// ContentServiceHandler is an implementation of the content.ContentService service.
type ContentServiceHandler interface {
	Save(context.Context, *connect_go.Request[content.Contents]) (*connect_go.Response[content.ContentIDs], error)
	Search(context.Context, *connect_go.Request[content.Query]) (*connect_go.Response[content.Results], error)
	Analyze(context.Context, *connect_go.Request[content.Content]) (*connect_go.Response[content.Contents], error)
	Delete(context.Context, *connect_go.Request[content.ContentIDs]) (*connect_go.Response[content.ContentIDs], error)
	GetTags(context.Context, *connect_go.Request[content.TagRequest]) (*connect_go.Response[content.Tags], error)
	SetTags(context.Context, *connect_go.Request[content.SetTagsRequest]) (*connect_go.Response[emptypb.Empty], error)
	Publish(context.Context, *connect_go.Request[content.ContentIDs]) (*connect_go.Response[content.ContentIDs], error)
	GetSources(context.Context, *connect_go.Request[emptypb.Empty]) (*connect_go.Response[content.Sources], error)
	Types(context.Context, *connect_go.Request[emptypb.Empty]) (*connect_go.Response[content.GRPCTypeInfo], error)
}

// NewContentServiceHandler builds an HTTP handler from the service implementation. It returns the
// path on which to mount the handler and the handler itself.
//
// By default, handlers support the Connect, gRPC, and gRPC-Web protocols with the binary Protobuf
// and JSON codecs. They also support gzip compression.
func NewContentServiceHandler(svc ContentServiceHandler, opts ...connect_go.HandlerOption) (string, http.Handler) {
	contentServiceSaveHandler := connect_go.NewUnaryHandler(
		ContentServiceSaveProcedure,
		svc.Save,
		opts...,
	)
	contentServiceSearchHandler := connect_go.NewUnaryHandler(
		ContentServiceSearchProcedure,
		svc.Search,
		opts...,
	)
	contentServiceAnalyzeHandler := connect_go.NewUnaryHandler(
		ContentServiceAnalyzeProcedure,
		svc.Analyze,
		opts...,
	)
	contentServiceDeleteHandler := connect_go.NewUnaryHandler(
		ContentServiceDeleteProcedure,
		svc.Delete,
		opts...,
	)
	contentServiceGetTagsHandler := connect_go.NewUnaryHandler(
		ContentServiceGetTagsProcedure,
		svc.GetTags,
		opts...,
	)
	contentServiceSetTagsHandler := connect_go.NewUnaryHandler(
		ContentServiceSetTagsProcedure,
		svc.SetTags,
		opts...,
	)
	contentServicePublishHandler := connect_go.NewUnaryHandler(
		ContentServicePublishProcedure,
		svc.Publish,
		opts...,
	)
	contentServiceGetSourcesHandler := connect_go.NewUnaryHandler(
		ContentServiceGetSourcesProcedure,
		svc.GetSources,
		opts...,
	)
	contentServiceTypesHandler := connect_go.NewUnaryHandler(
		ContentServiceTypesProcedure,
		svc.Types,
		opts...,
	)
	return "/content.ContentService/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case ContentServiceSaveProcedure:
			contentServiceSaveHandler.ServeHTTP(w, r)
		case ContentServiceSearchProcedure:
			contentServiceSearchHandler.ServeHTTP(w, r)
		case ContentServiceAnalyzeProcedure:
			contentServiceAnalyzeHandler.ServeHTTP(w, r)
		case ContentServiceDeleteProcedure:
			contentServiceDeleteHandler.ServeHTTP(w, r)
		case ContentServiceGetTagsProcedure:
			contentServiceGetTagsHandler.ServeHTTP(w, r)
		case ContentServiceSetTagsProcedure:
			contentServiceSetTagsHandler.ServeHTTP(w, r)
		case ContentServicePublishProcedure:
			contentServicePublishHandler.ServeHTTP(w, r)
		case ContentServiceGetSourcesProcedure:
			contentServiceGetSourcesHandler.ServeHTTP(w, r)
		case ContentServiceTypesProcedure:
			contentServiceTypesHandler.ServeHTTP(w, r)
		default:
			http.NotFound(w, r)
		}
	})
}

// UnimplementedContentServiceHandler returns CodeUnimplemented from all methods.
type UnimplementedContentServiceHandler struct{}

func (UnimplementedContentServiceHandler) Save(context.Context, *connect_go.Request[content.Contents]) (*connect_go.Response[content.ContentIDs], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("content.ContentService.Save is not implemented"))
}

func (UnimplementedContentServiceHandler) Search(context.Context, *connect_go.Request[content.Query]) (*connect_go.Response[content.Results], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("content.ContentService.Search is not implemented"))
}

func (UnimplementedContentServiceHandler) Analyze(context.Context, *connect_go.Request[content.Content]) (*connect_go.Response[content.Contents], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("content.ContentService.Analyze is not implemented"))
}

func (UnimplementedContentServiceHandler) Delete(context.Context, *connect_go.Request[content.ContentIDs]) (*connect_go.Response[content.ContentIDs], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("content.ContentService.Delete is not implemented"))
}

func (UnimplementedContentServiceHandler) GetTags(context.Context, *connect_go.Request[content.TagRequest]) (*connect_go.Response[content.Tags], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("content.ContentService.GetTags is not implemented"))
}

func (UnimplementedContentServiceHandler) SetTags(context.Context, *connect_go.Request[content.SetTagsRequest]) (*connect_go.Response[emptypb.Empty], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("content.ContentService.SetTags is not implemented"))
}

func (UnimplementedContentServiceHandler) Publish(context.Context, *connect_go.Request[content.ContentIDs]) (*connect_go.Response[content.ContentIDs], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("content.ContentService.Publish is not implemented"))
}

func (UnimplementedContentServiceHandler) GetSources(context.Context, *connect_go.Request[emptypb.Empty]) (*connect_go.Response[content.Sources], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("content.ContentService.GetSources is not implemented"))
}

func (UnimplementedContentServiceHandler) Types(context.Context, *connect_go.Request[emptypb.Empty]) (*connect_go.Response[content.GRPCTypeInfo], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("content.ContentService.Types is not implemented"))
}
