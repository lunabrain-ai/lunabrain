package main

//go:generate protoc --jsonschema_out=gen/jsonschema --proto_path=proto proto/ai.proto
//go:generate npx buf generate proto
//go:generate npm run build

import (
	"fmt"
	"github.com/lunabrain-ai/lunabrain/pkg/cli"
	"log/slog"
	"os"
)

func main() {
	app, err := cli.Wire()
	if err != nil {
		slog.Error("failed to wire app", "error", fmt.Sprintf("%+v", err))
		return
	}

	err = app.Rn(os.Args)
	if err != nil {
		slog.Error("failed to run app", "error", fmt.Sprintf("%+v", err))
		return
	}
}
