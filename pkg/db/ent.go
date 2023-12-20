package db

import (
	"context"
	"github.com/lunabrain-ai/lunabrain/pkg/ent"
	"github.com/lunabrain-ai/lunabrain/pkg/ent/migrate"
	"log/slog"
)

func NewEnt(c Config) (*ent.Client, error) {
	logFn := func(params ...any) {
		slog.Debug("ent", params)
	}
	client, err := ent.Open(
		c.Type,
		c.DSN,
		ent.Log(logFn),
		ent.Debug(),
	)
	if err != nil {
		return nil, err
	}
	err = client.Schema.Create(context.Background(),
		// TODO breadchris do not configure this for production
		// use https://entgo.io/docs/versioned-migrations
		migrate.WithDropIndex(true),
		migrate.WithDropColumn(true),
	)
	return client, err
}
