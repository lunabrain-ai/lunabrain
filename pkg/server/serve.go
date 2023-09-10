package server

import (
	"context"
	"fmt"
	"github.com/breadchris/scs/v2"
	"github.com/bufbuild/connect-go"
	grpcreflect "github.com/bufbuild/connect-grpcreflect-go"
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/gen/genconnect"
	"github.com/lunabrain-ai/lunabrain/pkg/api"
	"github.com/lunabrain-ai/lunabrain/pkg/chat/discord"
	code "github.com/lunabrain-ai/lunabrain/pkg/protoflow"
	"github.com/lunabrain-ai/lunabrain/pkg/store/bucket"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/lunabrain-ai/lunabrain/studio/public"
	"github.com/rs/zerolog/log"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"
)

type APIHTTPServer struct {
	sessionService   *scs.SessionManager
	config           api.Config
	db               db.Store
	apiServer        *api.Server
	bucket           *bucket.Bucket
	discordService   *discord.DiscordService
	protoflowService *code.Protoflow
}

type HTTPServer interface {
	Start() error
}

var (
	ProviderSet = wire.NewSet(
		scs.New,
		api.NewAPIServer,
		NewAPIHTTPServer,
		api.NewConfig,
		wire.Bind(new(HTTPServer), new(*APIHTTPServer)),
	)
)

func NewAPIHTTPServer(
	config api.Config,
	apiServer *api.Server,
	db db.Store,
	bucket *bucket.Bucket,
	d *discord.DiscordService,
	protoflowService *code.Protoflow,
	sessionSerivce *scs.SessionManager,
) *APIHTTPServer {
	return &APIHTTPServer{
		config:           config,
		apiServer:        apiServer,
		db:               db,
		bucket:           bucket,
		discordService:   d,
		protoflowService: protoflowService,
		sessionService:   sessionSerivce,
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

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Debug().Str("method", r.Method).Str("path", r.URL.Path).Msg("request")
		next.ServeHTTP(w, r)
	})
}

func (a *APIHTTPServer) NewAPIHandler() http.Handler {
	interceptors := connect.WithInterceptors(NewLogInterceptor())

	apiRoot := http.NewServeMux()

	apiRoot.Handle(genconnect.NewAPIHandler(a.apiServer, interceptors))
	apiRoot.Handle(genconnect.NewDiscordServiceHandler(a.discordService, interceptors))
	apiRoot.Handle(genconnect.NewProtoflowServiceHandler(a.protoflowService, interceptors))
	reflector := grpcreflect.NewStaticReflector(
		"lunabrain.API",
		"lunabrain.DiscordService",
	)
	recoverCall := func(_ context.Context, spec connect.Spec, _ http.Header, p any) error {
		log.Error().Msgf("%+v\n", p)
		if err, ok := p.(error); ok {
			return err
		}
		return fmt.Errorf("panic: %v", p)
	}
	apiRoot.Handle(grpcreflect.NewHandlerV1(reflector, connect.WithRecover(recoverCall)))
	// Many tools still expect the older version of the server reflection API, so
	// most servers should mount both handlers.
	apiRoot.Handle(grpcreflect.NewHandlerV1Alpha(reflector, connect.WithRecover(recoverCall)))

	assets := public.Assets
	fs := http.FS(public.Assets)
	httpFileServer := http.FileServer(fs)

	f := http.FS(os.DirFS("data"))
	mediaFileServer := http.FileServer(f)

	u, err := url.Parse(a.config.StudioProxy)
	if err != nil {
		log.Error().Err(err).Msg("failed to parse studio proxy")
		return nil
	}
	proxy := httputil.NewSingleHostReverseProxy(u)

	muxRoot := http.NewServeMux()

	// TODO breadchris fix this code, preferably with chi
	muxRoot.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			// redirect to /studio
			http.Redirect(w, r, "/studio", http.StatusFound)
			return
		}
		if r.URL.Path == "/media" || strings.HasPrefix(r.URL.Path, "/media/") {
			r.URL.Path = strings.Replace(r.URL.Path, "/media", "", 1)
			mediaFileServer.ServeHTTP(w, r)
			return
		}
		if r.URL.Path == "/studio" || strings.HasPrefix(r.URL.Path, "/studio/") || r.URL.Path == "/esbuild" {
			r.URL.Path = strings.Replace(r.URL.Path, "/studio", "", 1)

			if a.config.StudioProxy != "" {
				log.Debug().Msgf("proxying request: %s", r.URL.Path)
				proxy.ServeHTTP(w, r)
			} else {
				filePath := r.URL.Path
				if strings.Index(r.URL.Path, "/") == 0 {
					filePath = r.URL.Path[1:]
				}

				f, err := assets.Open(filePath)
				if os.IsNotExist(err) {
					r.URL.Path = "/"
				}
				if err == nil {
					f.Close()
				}
				log.Debug().Msgf("serving file: %s", filePath)
				httpFileServer.ServeHTTP(w, r)
			}
			return
		}
		if strings.HasPrefix(r.URL.Path, "/api/") {
			r.URL.Path = strings.Replace(r.URL.Path, "/api", "", 1)
		}
		apiRoot.ServeHTTP(w, r)
		return
	})

	// TODO breadchris enable/disable based on if we are in dev mode
	//bucketRoute, handler := a.bucket.HandleSignedURLs()
	//muxRoot.Handle(bucketRoute, handler)
	// TODO breadchris https://github.com/alexedwards/scs/tree/master/gormstore
	return a.sessionService.LoadAndSave(loggingMiddleware(muxRoot))
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
