package cli

import (
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/collect"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/transform"
	"github.com/lunabrain-ai/lunabrain/pkg/server"
	"github.com/urfave/cli/v2"
	"path/filepath"
)

func NewServeCommand(httpServer server.HTTPServer) *cli.Command {
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
				return collect.WatchForUrls(notesDir)
			}
			return collect.WatchForAudioFiles(notesDir)
		},
	}
}

func NewCollectCommand(
	discordCollect *collect.DiscordCollector,
	hnCollect *collect.HNCollect,
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
			//fileName := ctx.Args().First()
			//out := ctx.String("out")
			//
			//absPath, err := filepath.Abs(fileName)
			//if err != nil {
			//	return err
			//}
			//
			//transcript, err := normalizer.NormalizeFile(absPath, "audio")
			//if err != nil {
			//	return err
			//}
			//
			//if out != "" {
			//	err = os.WriteFile(out, []byte(transcript), 0644)
			//	if err != nil {
			//		return err
			//	}
			//} else {
			//	println(transcript)
			//}
			return nil
		},
	}
}

func NewTextCommand(summarizer transform.Summarizer) *cli.Command {
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
