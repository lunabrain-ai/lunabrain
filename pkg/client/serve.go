package client

import (
	"context"
	"fmt"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/google/wire"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/lunabrain-ai/lunabrain/pkg/api"
	"github.com/lunabrain-ai/lunabrain/pkg/client/html"
	"github.com/rs/zerolog/log"
	"github.com/twitchtv/twirp"
	"net/http"
	"os"
	"os/signal"
	"time"
)

type APIHTTPServer struct {
	config      api.Config
	apiServer   *api.Server
	twirpServer genapi.TwirpServer
	htmlContent *html.HTML
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

func NewAPIHTTPServer(config api.Config, apiServer *api.Server, htmlContent *html.HTML) *APIHTTPServer {
	twirpServer := genapi.NewAPIServer(apiServer, api.NewLoggingServerHooks(), twirp.WithServerPathPrefix("/api"))

	return &APIHTTPServer{
		config:      config,
		apiServer:   apiServer,
		twirpServer: twirpServer,
		htmlContent: htmlContent,
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

	// Use the CORS middleware with your router
	muxRoot.Use(cors.AllowAll().Handler)

	//muxRoot.Use(middleware.Recoverer)
	muxRoot.Use(middleware.Timeout(time.Second * 5))

	muxRoot.Handle(a.twirpServer.PathPrefix(), a.twirpServer)
	muxRoot.Route("/", a.getClientRoutes)
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
