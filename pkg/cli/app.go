package cli

import (
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
	apiServer *server.APIHTTPServer,
) *cli.App {
	return &cli.App{
		Name:   "lunabrain",
		Usage:  "Save and search for information.",
		Action: NewServeAction(apiServer),
		Commands: []*cli.Command{
			NewServeCommand(apiServer),
		},
	}
}
