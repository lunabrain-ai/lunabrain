package main

//go:generate protoc --jsonschema_out=pkg/gen/jsonschema --proto_path=proto proto/ai.proto
//go:generate npx buf generate proto

import (
	"fmt"
	"github.com/lunabrain-ai/lunabrain/pkg/cli"
	"log/slog"
	"os"
)

func init() {
	// TODO breadchris https://github.com/markbates/goth/blob/f347ee3e9478c9dee76c03d842220a14715cb3e6/gothic/gothic.go#L44C5-L44C5
	os.Setenv("SESSION_SECRET", "test")
}

func main() {
	app, err := cli.Wire()
	if err != nil {
		slog.Error("failed to wire app", "error", fmt.Sprintf("%+v", err))
		return
	}

	err = app.Run(os.Args)
	if err != nil {
		slog.Error("failed to run app", "error", fmt.Sprintf("%+v", err))
		return
	}
}
