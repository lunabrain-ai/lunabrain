package cli

import (
	collect2 "github.com/lunabrain-ai/lunabrain/pkg/content/source"
	"github.com/lunabrain-ai/lunabrain/pkg/server"
	"github.com/protoflow-labs/protoflow/pkg/util/reload"
	"github.com/urfave/cli/v2"
)

func NewServeCommand(
	httpServer server.HTTPServer,
) *cli.Command {
	return &cli.Command{
		Name:  "start",
		Usage: "start the server",
		Flags: []cli.Flag{
			&cli.BoolFlag{
				Name: "dev",
			},
		},
		Action: func(context *cli.Context) error {
			if context.Bool("dev") {
				return liveReload()
			}
			// TODO breadchris the protoflow server can be embedded here to help with debugging
			//go func() {
			//	err := protoflowServer.Start()
			//	if err != nil {
			//		log.Err(err).Msg("failed to start protoflow server")
			//	}
			//}()
			return httpServer.Start()
		},
	}
}

func liveReload() error {
	// TODO breadchris makes this a config that can be set
	c := reload.Config{
		Cmd: []string{"go", "run", "main.go", "start"},
		// ideally we use tilt here
		Targets:  []string{"pkg", "gen"},
		Patterns: []string{"**/*.go"},
	}
	// TODO breadchris this code needs to be refactored to use observability
	return reload.Reload(c)
}

func NewCollectCommand(
	discordCollect *collect2.DiscordCollector,
	hnCollect *collect2.HNCollect,
) *cli.Command {
	return &cli.Command{
		Name:  "collect",
		Usage: "Collect some data.",
		Subcommands: []*cli.Command{
			{
				Name: "hn",
				Action: func(ctx *cli.Context) error {
					return hnCollect.Collect()
				},
			},
			{
				Name: "discord",
				Flags: []cli.Flag{
					&cli.StringFlag{
						Name:     "channel",
						Required: true,
					},
				},
				Action: func(ctx *cli.Context) error {
					channel := ctx.String("channel")
					_, err := discordCollect.Collect(channel)
					return err
				},
			},
		},
	}
}
