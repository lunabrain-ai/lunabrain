package auth

import (
	"database/sql"
	"github.com/go-chi/chi"
)

func HandleRoutes(router chi.Router, db *sql.DB) {
	router.Post("/kratos/login", handleKratosLogin(db))
	router.Post("/oathkeeper/hydrate", handleOathkeeperHydrate(db))
}
