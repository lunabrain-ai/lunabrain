//go:build wireinject
// +build wireinject

package cli

import (
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/pkg/bucket"
	"github.com/lunabrain-ai/lunabrain/pkg/config"
	"github.com/lunabrain-ai/lunabrain/pkg/db"
	"github.com/lunabrain-ai/lunabrain/pkg/log"
	"github.com/lunabrain-ai/lunabrain/pkg/providers/openai"
	"github.com/lunabrain-ai/lunabrain/pkg/providers/whisper"
	"github.com/lunabrain-ai/lunabrain/pkg/server"
	"github.com/urfave/cli/v2"
)

func Wire() (*cli.App, error) {
	panic(wire.Build(
		NewApp,
		log.ProviderSet,
		config.ProviderSet,
		server.ProviderSet,
		db.ProviderSet,
		bucket.ProviderSet,
		openai.ProviderSet,
		whisper.ProviderSet,
	))
}
