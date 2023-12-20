package group

import "github.com/google/wire"

var ProviderSet = wire.NewSet(
	NewEntStore,
)
