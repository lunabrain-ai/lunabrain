package auth

import (
  "database/sql"
  "encoding/json"
  dbmodel "github.com/breadchris/sifty/backend/.gen/sifty/public/model"
  . "github.com/breadchris/sifty/backend/.gen/sifty/public/table"
  "github.com/breadchris/sifty/backend/pkg/auth/types"
  "github.com/rs/zerolog/log"
  "net/http"
)

func handleKratosLogin(db *sql.DB) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    var (
      err error
      req types.KratosHydrateRequest
    )

    err = json.NewDecoder(r.Body).Decode(&req)
    if err != nil {
      log.Error().
        Err(err).
        Msg("unable decode kratos hydrate request")
      return
    }

    upsertUserStmt := User.INSERT(
      User.KratosID,
    ).VALUES(
      req.Ctx.Identity.ID,
    ).ON_CONFLICT(
      User.KratosID,
    ).DO_NOTHING().
      RETURNING(User.ID)

    var user dbmodel.User

    err = upsertUserStmt.Query(db, &user)
    if err != nil {
      log.Error().
        Err(err).
        Msg("unable to upsert user")
      return
    }
  }
}
