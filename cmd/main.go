package main

import (
	"github.com/lunabrain-ai/lunabrain/pkg/cli"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"os"
)

func main() {
	// TODO (cthompson) this should be configured with an fx module
	logLevel := zerolog.InfoLevel
	if os.Getenv("LOG_LEVEL") == "debug" {
		logLevel = zerolog.DebugLevel
	}
	log.Logger = zerolog.New(os.Stderr).With().Timestamp().Logger().Level(logLevel)

	app, err := cli.Wire()
	if err != nil {
		panic(err)
	}

	err = app.Run(os.Args)
	if err != nil {
		log.Error().Msgf("%+v\n", err)
	}
}
