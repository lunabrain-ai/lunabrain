package cli

import (
	"github.com/lunabrain-ai/lunabrain/pkg/bot"
	"github.com/lunabrain-ai/lunabrain/pkg/log"
	"github.com/lunabrain-ai/lunabrain/pkg/server"
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
	discord *bot.Discord,
	hn *bot.HN,
) *cli.App {
	return &cli.App{
		Name:  "lunabrain",
		Usage: "Save and search for information.",
		Commands: []*cli.Command{
			NewServeCommand(httpServer),
			NewCollectCommand(discord, hn),
		},
	}
}
