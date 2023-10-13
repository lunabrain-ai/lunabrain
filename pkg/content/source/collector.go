package source

import "github.com/google/wire"

var ProviderSet = wire.NewSet(
	NewDiscordCollector,
	NewHNCollector,
)
