//go:build wireinject
// +build wireinject

package capture

import (
	"github.com/breadchris/sifty/backend/gen"
	"github.com/breadchris/sifty/backend/pkg/ml"
	"github.com/google/wire"
)

func Wire() (gen.PythonClient, error) {
	panic(wire.Build(ml.ProviderSet))
}
