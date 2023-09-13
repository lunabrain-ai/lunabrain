//go:build wireinject
// +build wireinject

package openai

import (
	"github.com/google/wire"
	"go.uber.org/config"
)

func Wire(c config.Provider) (QAClient, error) {
	panic(wire.Build(
		ProviderSet,
	))
}
