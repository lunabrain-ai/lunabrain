package main

import (
	"github.com/breadchris/sifty/backend/pkg/capture"
	"github.com/breadchris/sifty/backend/pkg/normalize"
	"github.com/breadchris/sifty/backend/pkg/openaifx"
	"github.com/breadchris/sifty/backend/pkg/sync"
	"github.com/breadchris/sifty/backend/pkg/text"
	"net/http"
	"os"
	"path/filepath"

	"github.com/ajvpot/clifx"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"github.com/urfave/cli/v2"
	"go.uber.org/fx"
)

type Params struct {
	fx.In
}

func NewCommand(p Params) clifx.CommandResult {
	return clifx.CommandResult{
		Command: &cli.Command{
			Name:  "sync",
			Usage: "Sync a directory of notes",
			Flags: []cli.Flag{
				&cli.BoolFlag{
					Name: "urls",
				},
			},
			Action: func(ctx *cli.Context) error {
				shouldSyncUrls := ctx.Bool("urls")
				notesDir := ctx.Args().First()

				if shouldSyncUrls {
					return sync.WatchForUrls(notesDir)
				}
				return sync.WatchForAudioFiles(notesDir)
			},
		},
	}
}

func NewCaptureCommand(p Params) clifx.CommandResult {
	return clifx.CommandResult{
		Command: &cli.Command{
			Name:  "capture",
			Usage: "Capture a new note",
			Action: func(ctx *cli.Context) error {
				fileName := ctx.Args().First()

				return capture.Record(fileName)
			},
		},
	}
}

func NewNoramlizeCommand(p Params) clifx.CommandResult {
	return clifx.CommandResult{
		Command: &cli.Command{
			Name:  "normalize",
			Usage: "Noramlize a note.",
			Flags: []cli.Flag{
				&cli.StringFlag{
					Name: "out",
				},
			},
			Action: func(ctx *cli.Context) error {
				fileName := ctx.Args().First()
				out := ctx.String("out")

				absPath, err := filepath.Abs(fileName)
				if err != nil {
					return err
				}

				transcript, err := normalize.Transcribe(absPath)
				if err != nil {
					return err
				}

				if out != "" {
					err = os.WriteFile(out, []byte(transcript), 0644)
					if err != nil {
						return err
					}
				} else {
					println(transcript)
				}
				return nil
			},
		},
	}
}

func NewTextCommand(p Params) clifx.CommandResult {
	return clifx.CommandResult{
		Command: &cli.Command{
			Name:  "text",
			Usage: "Process text.",
			Subcommands: []*cli.Command{
				{
					Name: "summarize",
					Action: func(ctx *cli.Context) error {
						fileName := ctx.Args().First()

						absPath, err := filepath.Abs(fileName)
						if err != nil {
							return err
						}

						transcript, err := text.Summarize(absPath)
						if err != nil {
							return err
						}
						println(transcript)
						return nil
					},
				},
			},
		},
	}
}

func main() {
	// TODO (cthompson) this should be configured with an fx module
	logLevel := zerolog.InfoLevel
	if os.Getenv("LOG_LEVEL") == "debug" {
		logLevel = zerolog.DebugLevel
	}
	log.Logger = zerolog.New(os.Stderr).With().Timestamp().Logger().Level(logLevel)

	clifx.Main(
		// TODO (cthompson) move this into an fx module
		fx.Supply(http.DefaultClient),

		openaifx.Module,

		fx.Provide(
			NewCommand,
			NewCaptureCommand,
			NewNoramlizeCommand,
			NewTextCommand,
		),

		fx.Supply(&clifx.AppConfig{
			Name:    "sifty",
			Usage:   "Sort information!",
			Version: "0.0.1",
		}),
	)
}
