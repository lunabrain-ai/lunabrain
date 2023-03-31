package collect

import "github.com/google/wire"

var ProviderSet = wire.NewSet(
	NewDiscordCollector,
	NewHNCollector,
)
