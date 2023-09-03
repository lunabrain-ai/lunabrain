package main

//go:generate protoc --go_out=./ --go-grpc_out=./ -I./proto "./proto/python.proto"
//go:generate npx buf generate proto

import (
	"github.com/lunabrain-ai/lunabrain/pkg/cli"
	"github.com/rs/zerolog/log"
	"os"
)

func main() {
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
