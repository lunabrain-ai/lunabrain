// Code generated by protoc-gen-connect-go. DO NOT EDIT.
//
// Source: python.proto

package genconnect

import (
	context "context"
	errors "errors"
	connect_go "github.com/bufbuild/connect-go"
	gen "github.com/lunabrain-ai/lunabrain/gen"
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
	// PythonName is the fully-qualified name of the Python service.
	PythonName = "python.Python"
)

// These constants are the fully-qualified names of the RPCs defined in this package. They're
// exposed at runtime as Spec.Procedure and as the final two segments of the HTTP route.
//
// Note that these are different from the fully-qualified method names used by
// google.golang.org/protobuf/reflect/protoreflect. To convert from these constants to
// reflection-formatted method names, remove the leading slash and convert the remaining slash to a
// period.
const (
	// PythonTranscribeProcedure is the fully-qualified name of the Python's Transcribe RPC.
	PythonTranscribeProcedure = "/python.Python/Transcribe"
	// PythonSummarizeProcedure is the fully-qualified name of the Python's Summarize RPC.
	PythonSummarizeProcedure = "/python.Python/Summarize"
	// PythonYoutubeTranscriptProcedure is the fully-qualified name of the Python's YoutubeTranscript
	// RPC.
	PythonYoutubeTranscriptProcedure = "/python.Python/YoutubeTranscript"
	// PythonNormalizeProcedure is the fully-qualified name of the Python's Normalize RPC.
	PythonNormalizeProcedure = "/python.Python/Normalize"
	// PythonCategorizeProcedure is the fully-qualified name of the Python's Categorize RPC.
	PythonCategorizeProcedure = "/python.Python/Categorize"
	// PythonIndexDirectoryProcedure is the fully-qualified name of the Python's IndexDirectory RPC.
	PythonIndexDirectoryProcedure = "/python.Python/IndexDirectory"
	// PythonQueryIndexProcedure is the fully-qualified name of the Python's QueryIndex RPC.
	PythonQueryIndexProcedure = "/python.Python/QueryIndex"
)

// PythonClient is a client for the python.Python service.
type PythonClient interface {
	Transcribe(context.Context, *connect_go.Request[gen.TranscribeRequest]) (*connect_go.Response[gen.TranscribeResponse], error)
	Summarize(context.Context, *connect_go.Request[gen.SummarizeRequest]) (*connect_go.Response[gen.SummarizeResponse], error)
	YoutubeTranscript(context.Context, *connect_go.Request[gen.Video]) (*connect_go.Response[gen.Transcript], error)
	Normalize(context.Context, *connect_go.Request[gen.Text]) (*connect_go.Response[gen.Text], error)
	Categorize(context.Context, *connect_go.Request[gen.CategorizeRequest]) (*connect_go.Response[gen.Categories], error)
	IndexDirectory(context.Context, *connect_go.Request[gen.IndexDirectoryRequest]) (*connect_go.Response[gen.Index], error)
	QueryIndex(context.Context, *connect_go.Request[gen.IndexQuery]) (*connect_go.Response[gen.QueryResult], error)
}

// NewPythonClient constructs a client for the python.Python service. By default, it uses the
// Connect protocol with the binary Protobuf Codec, asks for gzipped responses, and sends
// uncompressed requests. To use the gRPC or gRPC-Web protocols, supply the connect.WithGRPC() or
// connect.WithGRPCWeb() options.
//
// The URL supplied here should be the base URL for the Connect or gRPC server (for example,
// http://api.acme.com or https://acme.com/grpc).
func NewPythonClient(httpClient connect_go.HTTPClient, baseURL string, opts ...connect_go.ClientOption) PythonClient {
	baseURL = strings.TrimRight(baseURL, "/")
	return &pythonClient{
		transcribe: connect_go.NewClient[gen.TranscribeRequest, gen.TranscribeResponse](
			httpClient,
			baseURL+PythonTranscribeProcedure,
			opts...,
		),
		summarize: connect_go.NewClient[gen.SummarizeRequest, gen.SummarizeResponse](
			httpClient,
			baseURL+PythonSummarizeProcedure,
			opts...,
		),
		youtubeTranscript: connect_go.NewClient[gen.Video, gen.Transcript](
			httpClient,
			baseURL+PythonYoutubeTranscriptProcedure,
			opts...,
		),
		normalize: connect_go.NewClient[gen.Text, gen.Text](
			httpClient,
			baseURL+PythonNormalizeProcedure,
			opts...,
		),
		categorize: connect_go.NewClient[gen.CategorizeRequest, gen.Categories](
			httpClient,
			baseURL+PythonCategorizeProcedure,
			opts...,
		),
		indexDirectory: connect_go.NewClient[gen.IndexDirectoryRequest, gen.Index](
			httpClient,
			baseURL+PythonIndexDirectoryProcedure,
			opts...,
		),
		queryIndex: connect_go.NewClient[gen.IndexQuery, gen.QueryResult](
			httpClient,
			baseURL+PythonQueryIndexProcedure,
			opts...,
		),
	}
}

// pythonClient implements PythonClient.
type pythonClient struct {
	transcribe        *connect_go.Client[gen.TranscribeRequest, gen.TranscribeResponse]
	summarize         *connect_go.Client[gen.SummarizeRequest, gen.SummarizeResponse]
	youtubeTranscript *connect_go.Client[gen.Video, gen.Transcript]
	normalize         *connect_go.Client[gen.Text, gen.Text]
	categorize        *connect_go.Client[gen.CategorizeRequest, gen.Categories]
	indexDirectory    *connect_go.Client[gen.IndexDirectoryRequest, gen.Index]
	queryIndex        *connect_go.Client[gen.IndexQuery, gen.QueryResult]
}

// Transcribe calls python.Python.Transcribe.
func (c *pythonClient) Transcribe(ctx context.Context, req *connect_go.Request[gen.TranscribeRequest]) (*connect_go.Response[gen.TranscribeResponse], error) {
	return c.transcribe.CallUnary(ctx, req)
}

// Summarize calls python.Python.Summarize.
func (c *pythonClient) Summarize(ctx context.Context, req *connect_go.Request[gen.SummarizeRequest]) (*connect_go.Response[gen.SummarizeResponse], error) {
	return c.summarize.CallUnary(ctx, req)
}

// YoutubeTranscript calls python.Python.YoutubeTranscript.
func (c *pythonClient) YoutubeTranscript(ctx context.Context, req *connect_go.Request[gen.Video]) (*connect_go.Response[gen.Transcript], error) {
	return c.youtubeTranscript.CallUnary(ctx, req)
}

// Normalize calls python.Python.Normalize.
func (c *pythonClient) Normalize(ctx context.Context, req *connect_go.Request[gen.Text]) (*connect_go.Response[gen.Text], error) {
	return c.normalize.CallUnary(ctx, req)
}

// Categorize calls python.Python.Categorize.
func (c *pythonClient) Categorize(ctx context.Context, req *connect_go.Request[gen.CategorizeRequest]) (*connect_go.Response[gen.Categories], error) {
	return c.categorize.CallUnary(ctx, req)
}

// IndexDirectory calls python.Python.IndexDirectory.
func (c *pythonClient) IndexDirectory(ctx context.Context, req *connect_go.Request[gen.IndexDirectoryRequest]) (*connect_go.Response[gen.Index], error) {
	return c.indexDirectory.CallUnary(ctx, req)
}

// QueryIndex calls python.Python.QueryIndex.
func (c *pythonClient) QueryIndex(ctx context.Context, req *connect_go.Request[gen.IndexQuery]) (*connect_go.Response[gen.QueryResult], error) {
	return c.queryIndex.CallUnary(ctx, req)
}

// PythonHandler is an implementation of the python.Python service.
type PythonHandler interface {
	Transcribe(context.Context, *connect_go.Request[gen.TranscribeRequest]) (*connect_go.Response[gen.TranscribeResponse], error)
	Summarize(context.Context, *connect_go.Request[gen.SummarizeRequest]) (*connect_go.Response[gen.SummarizeResponse], error)
	YoutubeTranscript(context.Context, *connect_go.Request[gen.Video]) (*connect_go.Response[gen.Transcript], error)
	Normalize(context.Context, *connect_go.Request[gen.Text]) (*connect_go.Response[gen.Text], error)
	Categorize(context.Context, *connect_go.Request[gen.CategorizeRequest]) (*connect_go.Response[gen.Categories], error)
	IndexDirectory(context.Context, *connect_go.Request[gen.IndexDirectoryRequest]) (*connect_go.Response[gen.Index], error)
	QueryIndex(context.Context, *connect_go.Request[gen.IndexQuery]) (*connect_go.Response[gen.QueryResult], error)
}

// NewPythonHandler builds an HTTP handler from the service implementation. It returns the path on
// which to mount the handler and the handler itself.
//
// By default, handlers support the Connect, gRPC, and gRPC-Web protocols with the binary Protobuf
// and JSON codecs. They also support gzip compression.
func NewPythonHandler(svc PythonHandler, opts ...connect_go.HandlerOption) (string, http.Handler) {
	pythonTranscribeHandler := connect_go.NewUnaryHandler(
		PythonTranscribeProcedure,
		svc.Transcribe,
		opts...,
	)
	pythonSummarizeHandler := connect_go.NewUnaryHandler(
		PythonSummarizeProcedure,
		svc.Summarize,
		opts...,
	)
	pythonYoutubeTranscriptHandler := connect_go.NewUnaryHandler(
		PythonYoutubeTranscriptProcedure,
		svc.YoutubeTranscript,
		opts...,
	)
	pythonNormalizeHandler := connect_go.NewUnaryHandler(
		PythonNormalizeProcedure,
		svc.Normalize,
		opts...,
	)
	pythonCategorizeHandler := connect_go.NewUnaryHandler(
		PythonCategorizeProcedure,
		svc.Categorize,
		opts...,
	)
	pythonIndexDirectoryHandler := connect_go.NewUnaryHandler(
		PythonIndexDirectoryProcedure,
		svc.IndexDirectory,
		opts...,
	)
	pythonQueryIndexHandler := connect_go.NewUnaryHandler(
		PythonQueryIndexProcedure,
		svc.QueryIndex,
		opts...,
	)
	return "/python.Python/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case PythonTranscribeProcedure:
			pythonTranscribeHandler.ServeHTTP(w, r)
		case PythonSummarizeProcedure:
			pythonSummarizeHandler.ServeHTTP(w, r)
		case PythonYoutubeTranscriptProcedure:
			pythonYoutubeTranscriptHandler.ServeHTTP(w, r)
		case PythonNormalizeProcedure:
			pythonNormalizeHandler.ServeHTTP(w, r)
		case PythonCategorizeProcedure:
			pythonCategorizeHandler.ServeHTTP(w, r)
		case PythonIndexDirectoryProcedure:
			pythonIndexDirectoryHandler.ServeHTTP(w, r)
		case PythonQueryIndexProcedure:
			pythonQueryIndexHandler.ServeHTTP(w, r)
		default:
			http.NotFound(w, r)
		}
	})
}

// UnimplementedPythonHandler returns CodeUnimplemented from all methods.
type UnimplementedPythonHandler struct{}

func (UnimplementedPythonHandler) Transcribe(context.Context, *connect_go.Request[gen.TranscribeRequest]) (*connect_go.Response[gen.TranscribeResponse], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("python.Python.Transcribe is not implemented"))
}

func (UnimplementedPythonHandler) Summarize(context.Context, *connect_go.Request[gen.SummarizeRequest]) (*connect_go.Response[gen.SummarizeResponse], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("python.Python.Summarize is not implemented"))
}

func (UnimplementedPythonHandler) YoutubeTranscript(context.Context, *connect_go.Request[gen.Video]) (*connect_go.Response[gen.Transcript], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("python.Python.YoutubeTranscript is not implemented"))
}

func (UnimplementedPythonHandler) Normalize(context.Context, *connect_go.Request[gen.Text]) (*connect_go.Response[gen.Text], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("python.Python.Normalize is not implemented"))
}

func (UnimplementedPythonHandler) Categorize(context.Context, *connect_go.Request[gen.CategorizeRequest]) (*connect_go.Response[gen.Categories], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("python.Python.Categorize is not implemented"))
}

func (UnimplementedPythonHandler) IndexDirectory(context.Context, *connect_go.Request[gen.IndexDirectoryRequest]) (*connect_go.Response[gen.Index], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("python.Python.IndexDirectory is not implemented"))
}

func (UnimplementedPythonHandler) QueryIndex(context.Context, *connect_go.Request[gen.IndexQuery]) (*connect_go.Response[gen.QueryResult], error) {
	return nil, connect_go.NewError(connect_go.CodeUnimplemented, errors.New("python.Python.QueryIndex is not implemented"))
}
