package server

import (
	"context"
	"fmt"
	"github.com/bufbuild/connect-go"
	grpcreflect "github.com/bufbuild/connect-grpcreflect-go"
	"github.com/go-chi/chi/v5"
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/gen/genconnect"
	"github.com/lunabrain-ai/lunabrain/pkg/api"
	"github.com/lunabrain-ai/lunabrain/pkg/chat/discord"
	code "github.com/lunabrain-ai/lunabrain/pkg/protoflow"
	"github.com/lunabrain-ai/lunabrain/pkg/server/html"
	"github.com/lunabrain-ai/lunabrain/pkg/store/bucket"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/protoflow-labs/protoflow/pkg/protoflow"
	"github.com/rs/zerolog/log"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
	"net/http"
)

type APIHTTPServer struct {
	config           api.Config
	db               db.Store
	apiServer        *api.Server
	htmlContent      *html.HTML
	bucket           *bucket.Bucket
	discordService   *discord.DiscordService
	protoflowService *code.Protoflow
	p                *protoflow.Protoflow
}

type HTTPServer interface {
	Start() error
}

var (
	ProviderSet = wire.NewSet(
		api.NewAPIServer,
		NewAPIHTTPServer,
		api.NewConfig,
		html.NewHTML,
		wire.Bind(new(HTTPServer), new(*APIHTTPServer)),
	)
)

func NewAPIHTTPServer(
	config api.Config,
	apiServer *api.Server,
	htmlContent *html.HTML,
	db db.Store,
	bucket *bucket.Bucket,
	d *discord.DiscordService,
	protoflowService *code.Protoflow,
	p *protoflow.Protoflow,
) *APIHTTPServer {
	return &APIHTTPServer{
		config:           config,
		apiServer:        apiServer,
		htmlContent:      htmlContent,
		db:               db,
		bucket:           bucket,
		discordService:   d,
		protoflowService: protoflowService,
		p:                p,
	}
}

func NewLogInterceptor() connect.UnaryInterceptorFunc {
	interceptor := func(next connect.UnaryFunc) connect.UnaryFunc {
		return func(
			ctx context.Context,
			req connect.AnyRequest,
		) (connect.AnyResponse, error) {
			resp, err := next(ctx, req)
			if err != nil {
				log.Error().Msgf("connect error: %+v\n", err)
			}
			return resp, err
		}
	}
	return interceptor
}

func (a *APIHTTPServer) NewAPIHandler() http.Handler {
	muxRoot := http.NewServeMux()
	interceptors := connect.WithInterceptors(NewLogInterceptor())

	r := chi.NewRouter()
	a.getClientRoutes(r)

	muxRoot.Handle(genconnect.NewAPIHandler(a.apiServer, interceptors))
	muxRoot.Handle(genconnect.NewDiscordServiceHandler(a.discordService, interceptors))
	muxRoot.Handle(genconnect.NewProtoflowServiceHandler(a.protoflowService, interceptors))
	reflector := grpcreflect.NewStaticReflector(
		"lunabrain.API",
		"lunabrain.DiscordService",
		"protoflow.ProtoflowService",
	)
	recoverCall := func(_ context.Context, spec connect.Spec, _ http.Header, p any) error {
		log.Error().Msgf("%+v\n", p)
		if err, ok := p.(error); ok {
			return err
		}
		return fmt.Errorf("panic: %v", p)
	}
	muxRoot.Handle(grpcreflect.NewHandlerV1(reflector, connect.WithRecover(recoverCall)))
	// Many tools still expect the older version of the server reflection API, so
	// most servers should mount both handlers.
	muxRoot.Handle(grpcreflect.NewHandlerV1Alpha(reflector, connect.WithRecover(recoverCall)))
	muxRoot.Handle("/", r)

	// TODO breadchris enable/disable based on if we are in dev mode
	//bucketRoute, handler := a.bucket.HandleSignedURLs()
	//muxRoot.Handle(bucketRoute, handler)
	return muxRoot
}

func (a *APIHTTPServer) Start() error {
	httpApiHandler := a.NewAPIHandler()

	addr := fmt.Sprintf(":%s", a.config.Port)

	log.Info().Str("addr", addr).Msg("starting http server")

	//go func() {
	//	log.Debug().Msg("starting protoflow server")
	// // TODO listen for interupt
	//	// TODO breadchris configure port
	//	err := a.p.HTTPServer.Serve(8080)
	//	if err != nil {
	//		log.Error().Err(err).Msg("failed to start protoflow server")
	//	}
	//}()

	return http.ListenAndServe(addr, h2c.NewHandler(httpApiHandler, &http2.Server{}))
}
