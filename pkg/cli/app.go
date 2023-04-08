package cli

import (
	"github.com/lunabrain-ai/lunabrain/pkg/client"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/collect"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/transform"
	"github.com/urfave/cli/v2"
)

func NewApp(
	httpServer client.HTTPServer,
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
