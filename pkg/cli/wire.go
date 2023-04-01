//go:build wireinject
// +build wireinject

package cli

import (
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/pkg/chat/discord"
	"github.com/lunabrain-ai/lunabrain/pkg/client"
	"github.com/lunabrain-ai/lunabrain/pkg/config"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/collect"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize/text"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/publish"
	"github.com/lunabrain-ai/lunabrain/pkg/python"
	"github.com/lunabrain-ai/lunabrain/pkg/store"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/urfave/cli/v2"
)

func Wire() (*cli.App, error) {
	panic(wire.Build(
		NewApp,
		config.ProviderSet,
		client.ProviderSet,
		python.ProviderSet,
		store.ProviderSet,
		db.ProviderSet,
		normalize.ProviderSet,
		text.ProviderSet,
		discord.ProviderSet,
		publish.ProviderSet,
		collect.ProviderSet,
		pipeline.ProviderSet,
	))
}
