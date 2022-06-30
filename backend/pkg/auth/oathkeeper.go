package auth

import (
  "database/sql"
  "encoding/json"
  dbmodel "github.com/breadchris/sifty/backend/.gen/sifty/public/model"
  . "github.com/breadchris/sifty/backend/.gen/sifty/public/table"
  "github.com/breadchris/sifty/backend/pkg/auth/types"
  pgjet "github.com/go-jet/jet/v2/postgres"
  "github.com/rs/zerolog/log"
  "net/http"
)

func handleOathkeeperHydrate(db *sql.DB) http.HandlerFunc {
  return func(w http.ResponseWriter, r *http.Request) {
    var (
      err error
      req types.OathkeeperHydrateRequest
    )

    err = json.NewDecoder(r.Body).Decode(&req)
    if err != nil {
      log.Error().
        Err(err).
        Msg("unable decode hydrate request")
      w.WriteHeader(http.StatusInternalServerError)
      return
    }

    kratosUserId := req.Subject

    selectUserStmt := User.SELECT(
      User.ID,
    ).FROM(
      User.INNER_JOIN(Identities, Identities.ID.EQ(User.KratosID)),
    ).WHERE(User.KratosID.EQ(pgjet.String(kratosUserId)))

    var user dbmodel.User

    err = selectUserStmt.Query(db, &user)
    if err != nil {
      log.Error().
        Err(err).
        Str("kratos id", kratosUserId).
        Msg("unable to identify user id")
      // intentionally fall through
    }

    // either the user ID will be set or it will be an empty string, both are ok
    req.Extra.UserId = user.ID.String()

    err = json.NewEncoder(w).Encode(req)
    if err != nil {
      log.Error().
        Err(err).
        Msg("unable to encode hydrate response")
      w.WriteHeader(http.StatusInternalServerError)
      return
    }
  }
}
