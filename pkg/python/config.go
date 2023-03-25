package python

import (
	"github.com/rs/zerolog/log"
	"go.uber.org/config"
	"go.uber.org/fx"
)

const ConfigurationKey = "python"

type ConfigParams struct {
	fx.In
	Config config.Provider
}

type Config struct {
	Host string `yaml:"host"`
}

func NewConfig(config config.Provider) (cfg Config, err error) {
	err = config.Get(ConfigurationKey).Populate(&cfg)
	if err != nil {
		log.Error().Err(err).Msg("failed loading config")
		return
	}
	return
}
