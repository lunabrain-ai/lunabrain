package auth

import (
  "database/sql"
  "net/http"
)

func HandleOathkeeperHydrate(db *sql.DB) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    kratosUserId := r.Header.Get("X-Hasura-User-Id")

  })
}
