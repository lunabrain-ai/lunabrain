package cli

import (
	"github.com/lunabrain-ai/lunabrain/pkg/api"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/capture"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/text"
	"github.com/lunabrain-ai/lunabrain/pkg/sync"
	"github.com/lunabrain-ai/lunabrain/pkg/util"
	"github.com/rs/zerolog/log"
	"github.com/urfave/cli/v2"
	"os"
	"path/filepath"
)

func NewServeCommand(httpServer api.HTTPServer) *cli.Command {
	return &cli.Command{
		Name:  "api",
		Usage: "API server",
		Flags: []cli.Flag{},
		Subcommands: []*cli.Command{
			{
				Name: "serve",
				Action: func(context *cli.Context) error {
					return httpServer.Start()
				},
			},
		},
	}
}

func NewSyncCommand() *cli.Command {
	return &cli.Command{
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
	}
}

func NewCaptureCommand(normalizer normalize.Normalizer) *cli.Command {
	return &cli.Command{
		Name:  "capture",
		Usage: "Capture a new note",
		Flags: []cli.Flag{
			&cli.BoolFlag{
				Name: "normalize",
			},
		},
		Action: func(ctx *cli.Context) error {
			fileName := util.GenerateFilename("recording", "aiff")
			err := capture.Record(fileName)
			if err != nil {
				return err
			}

			if ctx.Bool("normalize") {
				log.Info().Msg("normalizing")
				transcript, err := normalizer.NormalizeFile(fileName, "audio")
				if err != nil {
					return err
				}
				log.Info().Str("transcript", transcript).Msg("done normalizing audio")
			}
			return nil
		},
	}
}

func NewNormalizeCommand(normalizer normalize.Normalizer) *cli.Command {
	return &cli.Command{
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

			transcript, err := normalizer.NormalizeFile(absPath, "audio")
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
	}
}

func NewTextCommand(summarizer text.Summarizer) *cli.Command {
	return &cli.Command{
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

					transcript, err := summarizer.SummarizeFile(absPath)
					if err != nil {
						return err
					}
					println(transcript)
					return nil
				},
			},
		},
	}
}
