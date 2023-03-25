package cli

import (
	"github.com/lunabrain-ai/lunabrain/pkg/api"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/text"
	"github.com/urfave/cli/v2"
)

func NewApp(
	httpServer api.HTTPServer,
	normalizer normalize.Normalizer,
	summarizer text.Summarizer,
) *cli.App {
	return &cli.App{
		Name:  "lunabrain",
		Usage: "Save and search for information.",
		Commands: []*cli.Command{
			NewServeCommand(httpServer),
			NewSyncCommand(),
			NewCaptureCommand(normalizer),
			NewNormalizeCommand(normalizer),
			NewTextCommand(summarizer),
		},
	}
}
