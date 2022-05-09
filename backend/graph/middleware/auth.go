package middleware

import (
	"context"
	"database/sql"
	"errors"
	"github.com/rs/zerolog/log"
	"net/http"
	"net/http/httputil"
)

// A private key for context that only this package can access. This is important
// to prevent collisions between different context uses
var userCtxKey = &contextKey{"user"}

type contextKey struct {
	name string
}

// A stand-in for our database backed user object
type User struct {
	Name    string
	IsAdmin bool
}

// Auth decodes the share session cookie and packs the session into context
func ProvideAuth(db *sql.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			dumpedRequest, _ := httputil.DumpRequest(r, true)
			println(string(dumpedRequest))

			userId := r.Header.Get("X-Hasura-User-Id")

			ctx := context.WithValue(r.Context(), userCtxKey, userId)
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

// UserIdFromContext finds the user from the context.
func UserIdFromContext(ctx context.Context) (userId string, err error) {
	userId, ok := ctx.Value(userCtxKey).(string)
	if !ok {
		err = errors.New("unable to get user from context")
		log.Error().Err(err).Msg("error while getting user from context")
	}

	// HACK (cthompson) I could not get ProvideAuth to return an error that didn't cause the UI to freeze
	if userId == "" {
		return "", errors.New("user is not authenticated")
	}
	return
}
