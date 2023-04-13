package store

import (
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/pkg/store/cache"
)

var (
	ProviderSet = wire.NewSet(
		cache.ProviderSet,
		NewLocalBucket,
	)
)
