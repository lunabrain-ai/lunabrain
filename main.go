package main

//go:generate protoc --go_out=./ --go-grpc_out=./ -I./proto "./proto/python.proto"
//go:generate buf generate proto

import (
	"github.com/lunabrain-ai/lunabrain/pkg/cli"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	"os"
	"strings"
)

func setupLogging() {
	logLevel := zerolog.InfoLevel
	if strings.ToLower(os.Getenv("LOG_LEVEL")) == "debug" {
		logLevel = zerolog.DebugLevel
	}
	log.Logger = log.With().Caller().Logger().Output(zerolog.ConsoleWriter{Out: os.Stderr}).Level(logLevel)
}

func main() {
	// TODO breadchris find a nicer way to do this?
	setupLogging()

	app, err := cli.Wire()
	if err != nil {
		log.Error().Msgf("%+v\n", err)
		return
	}

	err = app.Run(os.Args)
	if err != nil {
		log.Error().Msgf("%+v\n", err)
		return
	}
}
