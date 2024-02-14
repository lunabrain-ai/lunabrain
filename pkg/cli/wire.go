//go:build wireinject
// +build wireinject

package cli

import (
	"github.com/google/wire"
	"github.com/justshare-io/justshare/pkg/bucket"
	"github.com/justshare-io/justshare/pkg/config"
	"github.com/justshare-io/justshare/pkg/db"
	"github.com/justshare-io/justshare/pkg/log"
	"github.com/justshare-io/justshare/pkg/providers/openai"
	"github.com/justshare-io/justshare/pkg/providers/whisper"
	"github.com/justshare-io/justshare/pkg/server"
	"github.com/urfave/cli/v2"
)

func Wire() (*cli.App, error) {
	panic(wire.Build(
		NewApp,
		log.ProviderSet,
		config.ProviderSet,
		server.ProviderSet,
		db.ProviderSet,
		bucket.ProviderSet,
		openai.ProviderSet,
		whisper.ProviderSet,
	))
}
