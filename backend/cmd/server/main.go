package main

import (
	"database/sql"
	"github.com/99designs/gqlgen/graphql/handler/debug"
	"github.com/breadchris/sifty/backend/graph/middleware"
	"github.com/breadchris/sifty/backend/internal/auth"
	"github.com/go-chi/chi"
	"github.com/rs/zerolog/log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/breadchris/sifty/backend/graph"
	"github.com/breadchris/sifty/backend/graph/generated"
)

const defaultPort = "8088"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	router := chi.NewRouter()

	db, err := sql.Open("postgres", "postgres://postgres:secretpgpassword@localhost:5432/sifty?sslmode=disable")
	if err != nil {
		log.Error().
			Err(err).
			Msg("unable to open database connection")
		panic(err)
	}
	defer db.Close()

	router.Use(middleware.ProvideAuth(db))
	router.Use(middleware.ProvideDB(db))

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))
	srv.Use(&debug.Tracer{})

	router.Handle("/", playground.Handler("GraphQL playground", "/v1/graphql"))
	router.Handle("/v1/graphql", srv)

	oathkeeperHydrate := auth.HandleOathkeeperHydrate()
	router.Handle("/oathkeeper/hydrate/user", oathkeeperHydrate)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	err = http.ListenAndServe(":"+port, router)
	panic(err)
}
