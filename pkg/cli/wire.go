//go:build wireinject
// +build wireinject

package cli

import (
	"github.com/lunabrain-ai/lunabrain/pkg/api"
	"github.com/lunabrain-ai/lunabrain/pkg/config"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/text"
	"github.com/lunabrain-ai/lunabrain/pkg/python"
	"github.com/lunabrain-ai/lunabrain/pkg/store"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/google/wire"
	"github.com/urfave/cli/v2"
)

func Wire() (*cli.App, error) {
	panic(wire.Build(
		NewApp,
		config.ProviderSet,
		api.ProviderSet,
		python.ProviderSet,
		store.ProviderSet,
		db.ProviderSet,
		normalize.ProviderSet,
		text.ProviderSet,
	))
}
