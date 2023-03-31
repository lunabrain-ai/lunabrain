package cli

import "github.com/google/wire"

var (
	ProviderSet = wire.NewSet(
		NewSyncCommand,
		NewCollectCommand,
		NewNormalizeCommand,
		NewTextCommand,
	)
)
