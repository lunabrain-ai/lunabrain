package api

import (
	"context"
	"fmt"
	"github.com/lunabrain-ai/lunabrain/client/public"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/google/wire"
	"github.com/rs/zerolog/log"
	"github.com/twitchtv/twirp"
	"io/fs"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"time"
)

type APIHTTPServer struct {
	config      Config
	twirpServer genapi.TwirpServer
	assets      fs.FS
}

type HTTPServer interface {
	Start() error
}

var (
	ProviderSet = wire.NewSet(
		NewAPIServer,
		NewAPIHTTPServer,
		NewConfig,
		wire.Bind(new(HTTPServer), new(*APIHTTPServer)),
	)
)

func NewAPIHTTPServer(config Config, apiServer *Server) *APIHTTPServer {
	twirpServer := genapi.NewAPIServer(apiServer, NewLoggingServerHooks(), twirp.WithServerPathPrefix("/api"))

	var assets fs.FS
	if config.Local {
		assets = os.DirFS("client/public")
	} else {
		assets = public.Assets
	}

	return &APIHTTPServer{
		config:      config,
		twirpServer: twirpServer,
		assets:      assets,
	}
}

func (a *APIHTTPServer) NewAPIHandler() http.Handler {
	muxRoot := chi.NewRouter()

	muxRoot.Use(middleware.RequestID)
	muxRoot.Use(middleware.RealIP)
	muxRoot.Use(middleware.Logger)
	//muxRoot.Use(session.Sessioner(session.Options{
	//	Provider:           "file",
	//	CookieName:         "session",
	//	FlashEncryptionKey: "SomethingSuperSecretThatShouldChange",
	//}))

	// Define CORS options
	corsOptions := cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
		MaxAge:           300,
	}

	// Use the CORS middleware with your router
	muxRoot.Use(cors.Handler(corsOptions))

	//muxRoot.Use(middleware.Recoverer)
	muxRoot.Use(middleware.Timeout(time.Second * 5))

	fs := http.FS(a.assets)
	httpFileServer := http.FileServer(fs)

	muxRoot.Handle("/*", http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, a.twirpServer.PathPrefix()) {
			a.twirpServer.ServeHTTP(rw, r)
			return
		}

		filePath := r.URL.Path
		if strings.Index(r.URL.Path, "/") == 0 {
			filePath = r.URL.Path[1:]
		}

		f, err := a.assets.Open(filePath)
		if os.IsNotExist(err) {
			r.URL.Path = "/"
		}

		if err == nil {
			f.Close()
		}

		log.Warn().Err(err).Str("url", r.URL.Path).Msg("could not open file")

		httpFileServer.ServeHTTP(rw, r)
	}))
	return muxRoot
}

func (a *APIHTTPServer) Start() error {
	httpApiHandler := a.NewAPIHandler()

	addr := fmt.Sprintf(":%s", a.config.Port)

	httpServer := &http.Server{
		Addr:    addr,
		Handler: httpApiHandler,
	}

	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt)

	log.Info().Str("addr", addr).Msg("starting http server")

	go func(server *http.Server) {
		if err := server.ListenAndServe(); err != nil {
			log.Error().Err(err).Msg("could not start http server")
		}
	}(httpServer)

	<-signals
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*9)
	defer cancel()
	return httpServer.Shutdown(ctx)
}
