//go:build wireinject
// +build wireinject

package cli

import (
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/pkg/chat/discord"
	"github.com/lunabrain-ai/lunabrain/pkg/config"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/collect"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/transform"
	"github.com/lunabrain-ai/lunabrain/pkg/protoflow"
	"github.com/lunabrain-ai/lunabrain/pkg/publish"
	"github.com/lunabrain-ai/lunabrain/pkg/python"
	"github.com/lunabrain-ai/lunabrain/pkg/server"
	"github.com/lunabrain-ai/lunabrain/pkg/store/bucket"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/lunabrain-ai/lunabrain/pkg/whisper"
	"github.com/protoflow-labs/protoflow/pkg/log"
	"github.com/protoflow-labs/protoflow/pkg/openai"
	"github.com/urfave/cli/v2"
)

func Wire() (*cli.App, error) {
	panic(wire.Build(
		NewApp,
		log.ProviderSet,
		config.ProviderSet,
		server.ProviderSet,
		python.ProviderSet,
		db.ProviderSet,
		bucket.ProviderSet,
		normalize.ProviderSet,
		transform.ProviderSet,
		discord.ProviderSet,
		publish.ProviderSet,
		collect.ProviderSet,
		pipeline.ProviderSet,
		protoflow.ProviderSet,
		//api.ProviderSet,
		openai.ProviderSet,
		whisper.ProviderSet,
	))
}
