//go:build wireinject
// +build wireinject

package cli

import (
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/pkg/chat/discord"
	"github.com/lunabrain-ai/lunabrain/pkg/config"
	"github.com/lunabrain-ai/lunabrain/pkg/db"
	"github.com/lunabrain-ai/lunabrain/pkg/openai"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/collect"
	"github.com/lunabrain-ai/lunabrain/pkg/protoflow"
	"github.com/lunabrain-ai/lunabrain/pkg/server"
	"github.com/lunabrain-ai/lunabrain/pkg/store/bucket"
	"github.com/lunabrain-ai/lunabrain/pkg/whisper"
	"github.com/protoflow-labs/protoflow/pkg/log"
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
		discord.ProviderSet,
		//publish.ProviderSet,
		collect.ProviderSet,
		protoflow.ProviderSet,
		openai.ProviderSet,
		whisper.ProviderSet,
	))
}
