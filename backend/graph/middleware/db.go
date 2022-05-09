package middleware

import (
	"context"
	"database/sql"
	"errors"
	"github.com/rs/zerolog/log"
	"net/http"
)

// A private key for context that only this package can access. This is important
// to prevent collisions between different context uses
var dbCtxKey = &contextKey{"db"}

func ProvideDB(db *sql.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx := context.WithValue(r.Context(), dbCtxKey, db)
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

// DBFromContext finds the user from the context.
func DBFromContext(ctx context.Context) (db *sql.DB, err error) {
	db, ok := ctx.Value(dbCtxKey).(*sql.DB)
	if !ok {
		err = errors.New("unable to get db from context")
		log.Error().Err(err).Msg("error while getting db from context")
	}
	return
}
