package server

import (
	"context"
	"fmt"
	"github.com/bufbuild/connect-go"
	grpcreflect "github.com/bufbuild/connect-grpcreflect-go"
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/js/dist/site"
	"github.com/lunabrain-ai/lunabrain/pkg/bucket"
	"github.com/lunabrain-ai/lunabrain/pkg/chat"
	"github.com/lunabrain-ai/lunabrain/pkg/content"
	"github.com/lunabrain-ai/lunabrain/pkg/content/normalize"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/chat/chatconnect"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/content/contentconnect"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/user/userconnect"
	"github.com/lunabrain-ai/lunabrain/pkg/group"
	shttp "github.com/lunabrain-ai/lunabrain/pkg/http"
	"github.com/lunabrain-ai/lunabrain/pkg/user"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"
	"log/slog"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"
)

type APIHTTPServer struct {
	config         content.Config
	contentService *content.Service
	bucket         *bucket.Bucket
	sessionManager *shttp.SessionManager
	userService    *user.UserService
	chatService    *chat.Service
}

type HTTPServer interface {
	Start() error
}

var (
	ProviderSet = wire.NewSet(
		content.ProviderSet,
		group.ProviderSet,
		user.ProviderSet,
		chat.ProviderSet,
		normalize.New,
		shttp.NewSession,
		content.NewConfig,
		New,
		wire.Bind(new(HTTPServer), new(*APIHTTPServer)),
	)
)

func New(
	config content.Config,
	apiServer *content.Service,
	bucket *bucket.Bucket,
	sessionManager *shttp.SessionManager,
	userService *user.UserService,
	chatService *chat.Service,
) *APIHTTPServer {
	return &APIHTTPServer{
		config:         config,
		contentService: apiServer,
		bucket:         bucket,
		sessionManager: sessionManager,
		userService:    userService,
		chatService:    chatService,
	}
}

func NewLogInterceptor() connect.UnaryInterceptorFunc {
	// TODO breadchris support logging for stream calls
	return func(next connect.UnaryFunc) connect.UnaryFunc {
		return func(
			ctx context.Context,
			req connect.AnyRequest,
		) (connect.AnyResponse, error) {
			resp, err := next(ctx, req)
			if err != nil {
				slog.Error("connect error", "error", fmt.Sprintf("%+v", err))
				// TODO breadchris this should only be done for local dev
				fmt.Printf("%+v\n", err)
			}
			return resp, err
		}
	}
}

func loggingMiddleware(next http.Handler) http.Handler {
	//limiter := NewRateLimiter()
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//peerIP := r.Header.Get("x-forwarded-for")
		//if peerIP != "" {
		//	if !limiter.Visit(peerIP) {
		//		//slog.Warn("rate limit exceeded", "peerIP", peerIP)
		//		http.Error(w, http.StatusText(http.StatusTooManyRequests), http.StatusTooManyRequests)
		//		return
		//	}
		//}

		slog.Debug("request", "method", r.Method, "path", r.URL.Path)
		next.ServeHTTP(w, r)
	})
}

func (a *APIHTTPServer) NewAPIHandler() http.Handler {
	interceptors := connect.WithInterceptors(NewLogInterceptor())

	apiRoot := http.NewServeMux()

	apiRoot.Handle(contentconnect.NewContentServiceHandler(a.contentService, interceptors))
	apiRoot.Handle(userconnect.NewUserServiceHandler(a.userService, interceptors))
	apiRoot.Handle(chatconnect.NewChatServiceHandler(a.chatService, interceptors))
	reflector := grpcreflect.NewStaticReflector(
		"content.ContentService",
		"user.UserService",
		"chat.ChatService",
	)
	recoverCall := func(_ context.Context, spec connect.Spec, _ http.Header, p any) error {
		slog.Error("panic", "err", fmt.Sprintf("%+v", p))
		if err, ok := p.(error); ok {
			return err
		}
		return fmt.Errorf("panic: %v", p)
	}
	apiRoot.Handle(grpcreflect.NewHandlerV1(reflector, connect.WithRecover(recoverCall)))
	// Many tools still expect the older version of the server reflection Service, so
	// most servers should mount both handlers.
	apiRoot.Handle(grpcreflect.NewHandlerV1Alpha(reflector, connect.WithRecover(recoverCall)))

	assets := site.Assets
	fs := http.FS(site.Assets)
	httpFileServer := http.FileServer(fs)

	// TODO breachris this should come from bucket
	f := http.FS(os.DirFS("data"))
	mediaFileServer := http.FileServer(f)

	// TODO breadchris brittle path
	blog := http.FS(os.DirFS("data/blog"))
	blogFileServer := http.FileServer(blog)

	u, err := url.Parse(a.config.Proxy)
	if err != nil {
		slog.Error("failed to parse proxy", "error", err)
		return nil
	}
	proxy := httputil.NewSingleHostReverseProxy(u)

	muxRoot := http.NewServeMux()

	muxRoot.HandleFunc("/webhook", func(w http.ResponseWriter, r *http.Request) {
		// dump http request
		dump, err := httputil.DumpRequest(r, true)
		if err != nil {
			slog.Error("failed to dump request", "error", err)
			return
		}
		slog.Debug("webhook request", "dump", string(dump))
	})

	// TODO breadchris path routing should be done in a more modular way, as opposed to being done all in the handler
	muxRoot.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/@") {
			_ = strings.Replace(r.URL.Path, "/@", "", 1)
			println("path", r.URL.Path)
			blogFileServer.ServeHTTP(w, r)
			return
		}
		if r.URL.Path == "/" {
			http.Redirect(w, r, "/app", http.StatusFound)
			return
		}
		if r.URL.Path == "/media" || strings.HasPrefix(r.URL.Path, "/media/") {
			r.URL.Path = strings.Replace(r.URL.Path, "/media", "", 1)
			mediaFileServer.ServeHTTP(w, r)
			return
		}
		if r.URL.Path == "/app" || strings.HasPrefix(r.URL.Path, "/app/") || r.URL.Path == "/esbuild" {
			r.URL.Path = strings.Replace(r.URL.Path, "/app", "", 1)
			if a.config.Proxy != "" {
				slog.Debug("proxying request", "path", r.URL.Path)
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
				slog.Debug("serving file", "path", filePath)
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
	return a.sessionManager.LoadAndSave(loggingMiddleware(muxRoot))
}

func (a *APIHTTPServer) Start() error {
	httpApiHandler := a.NewAPIHandler()

	addr := fmt.Sprintf(":%s", a.config.Port)

	slog.Info("starting http server", "addr", addr)

	//go func() {
	//	log.Debug().Msg("starting protoflow server")
	// // TODO listen for interupt
	//	// TODO breadchris configure port
	//	err := a.p.HTTPServer.Serve(8080)
	//	if err != nil {
	//		log.Error().Err(err).Msg("failed to start protoflow server")
	//	}
	//}()

	return http.ListenAndServe(addr, h2c.NewHandler(corsMiddleware(httpApiHandler), &http2.Server{}))
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// TODO breadchris how bad is this? lol
		origin := r.Header.Get("Origin")

		// TODO breadchris this should only be done for local dev
		w.Header().Set("Access-Control-Allow-Origin", origin)

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Authorization, connect-protocol-version")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}
