package main

//go:generate protoc --jsonschema_out=pkg/gen/jsonschema --proto_path=proto proto/ai.proto
//go:generate npx buf generate proto

import (
	"fmt"
	"github.com/justshare-io/justshare/pkg/cli"
	"log/slog"
	"os"
)

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
