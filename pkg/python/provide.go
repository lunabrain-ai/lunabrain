package python

import "github.com/google/wire"

var (
	ProviderSet = wire.NewSet(
		NewConfig,
		NewPythonClient,
	)
)
