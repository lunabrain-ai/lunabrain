package cli

import (
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/collect"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/transform"
	"github.com/lunabrain-ai/lunabrain/pkg/server"
	"github.com/protoflow-labs/protoflow/pkg/log"
	"github.com/urfave/cli/v2"
)

type Commands struct {
	Serve *cli.Command
	Sync  *cli.Command
}

func NewApp(
	// TODO breadchris needed so wire will pick it up as a dep
	log *log.Log,
	httpServer server.HTTPServer,
	normalizer normalize.Normalizer,
	summarizer transform.Summarizer,
	discordCollect *collect.DiscordCollector,
	hnCollect *collect.HNCollect,
) *cli.App {
	return &cli.App{
		Name:  "lunabrain",
		Usage: "Save and search for information.",
		Commands: []*cli.Command{
			NewServeCommand(httpServer),
			NewSyncCommand(),
			NewCollectCommand(discordCollect, hnCollect),
			NewNormalizeCommand(normalizer),
			NewTextCommand(summarizer),
		},
	}
}
