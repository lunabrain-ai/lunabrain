package main

import (
  "database/sql"
  "github.com/99designs/gqlgen/graphql/handler/debug"
  "github.com/breadchris/sifty/backend/graph/middleware"
  "github.com/breadchris/sifty/backend/pkg/auth"
  "github.com/go-chi/chi"
  "github.com/rs/zerolog/log"
  "net/http"
  "os"

  "github.com/99designs/gqlgen/graphql/handler"
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

  router.Use(
    // debug requests
    func(next http.Handler) http.Handler {
      return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        log.Info().
          Str("method", r.Method).
          Str("path", r.URL.Path).
          Msg("request")
        next.ServeHTTP(w, r)
        return
      })
    },
    middleware.ProvideAuth(),
    middleware.ProvideDB(db),
  )

  auth.HandleRoutes(router, db)

  srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: &graph.Resolver{}}))
  srv.Use(&debug.Tracer{})

  router.Handle("/v1/graphql", srv)

  log.Info().
    Str("port", port).
    Msg("starting server")
  err = http.ListenAndServe(":"+port, router)
  panic(err)
}
