package cli

import (
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	dutil "github.com/lunabrain-ai/lunabrain/pkg/chat/discord/util"
	"github.com/lunabrain-ai/lunabrain/pkg/client"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/collect"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize/text"
	"github.com/lunabrain-ai/lunabrain/pkg/util"
	"github.com/urfave/cli/v2"
	"path/filepath"
)

func NewServeCommand(httpServer client.HTTPServer) *cli.Command {
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
	workflow pipeline.Workflow,
	discordCollect *collect.DiscordCollector,
	hnCollect *collect.HNCollect,
) *cli.Command {
	return &cli.Command{
		Name:  "collect",
		Usage: "Collect some data.",
		Subcommands: []*cli.Command{
			{
				Name: "audio",
				Action: func(ctx *cli.Context) error {
					fileName := util.GenerateFilename("recording", "aiff")
					err := collect.Record(fileName)
					if err != nil {
						return err
					}
					return nil
				},
			},
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
					msgs, err := discordCollect.Collect(channel)
					if err != nil {
						return err
					}

					// TODO breadchris this logic should be moved into collect?
					transcript := dutil.GenerateTranscript(msgs)
					_, err = workflow.ProcessContent(ctx.Context, &genapi.Content{
						Data: []byte(transcript),
						Type: genapi.ContentType_TEXT,
					})
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
