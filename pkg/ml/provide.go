package ml

import "github.com/google/wire"

var (
	ProviderSet wire.ProviderSet = wire.NewSet(
		NewPythonClient,
	)
)
