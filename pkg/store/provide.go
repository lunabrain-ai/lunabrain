package store

import "github.com/google/wire"

var (
	ProviderSet = wire.NewSet(
		NewFolderCache,
		wire.Bind(new(Cache), new(*FolderCache)),
		NewBucket,
	)
)
