package cli

import (
	"bufio"
	"github.com/justshare-io/justshare/pkg/bot"
	"github.com/justshare-io/justshare/pkg/server"
	"github.com/protoflow-labs/protoflow/pkg/util/reload"
	"github.com/urfave/cli/v2"
	"log/slog"
	"os/exec"
)

func startProcess(cmd *exec.Cmd) (cleanup func(), err error) {
	stderr, err := cmd.StderrPipe()
	if err != nil {
		return nil, err
	}

	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return nil, err
	}
	cleanup = func() {
		stdout.Close()
		stderr.Close()
	}

	stderrScan := bufio.NewScanner(stderr)
	go func() {
		for stderrScan.Scan() {
			slog.Info(cmd.String(), "stderr", stderrScan.Text())
		}
	}()

	scanner := bufio.NewScanner(stdout)
	go func() {
		for scanner.Scan() {
			slog.Info(cmd.String(), "stdout", stderrScan.Text())
		}
	}()

	slog.Debug(cmd.String())

	if err = cmd.Start(); err != nil {
		return nil, err
	}
	return cleanup, nil
}

func NewServeAction(httpServer *server.APIHTTPServer) func(context *cli.Context) error {
	return func(context *cli.Context) error {
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
	}
}

func NewServeCommand(
	httpServer *server.APIHTTPServer,
) *cli.Command {
	return &cli.Command{
		Name:  "start",
		Usage: "start the server",
		Flags: []cli.Flag{
			&cli.BoolFlag{
				Name: "dev",
			},
		},
		Action: NewServeAction(httpServer),
	}
}

func liveReload() error {
	// TODO breadchris makes this a config that can be set
	c := reload.Config{
		Cmd: []string{"go", "run", "main.go", "start"},
		// ideally we use tilt here
		Targets:  []string{"pkg"},
		Patterns: []string{"**/*.go"},
	}
	// TODO breadchris this code needs to be refactored to use observability
	return reload.Reload(c)
}

func NewCollectCommand(
	discordBot *bot.Discord,
	hnBot *bot.HN,
) *cli.Command {
	return &cli.Command{
		Name:  "bot",
		Usage: "Start a bot.",
		Subcommands: []*cli.Command{
			{
				Name: "hn",
				Flags: []cli.Flag{
					&cli.StringFlag{
						Name:     "user-id",
						Required: true,
					},
				},
				Action: func(ctx *cli.Context) error {
					return hnBot.Collect(ctx.String("user-id"))
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
					_, err := discordBot.Collect(channel)
					return err
				},
			},
		},
	}
}
