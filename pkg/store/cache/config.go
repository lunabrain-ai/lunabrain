package cache

import (
	"github.com/rs/zerolog/log"
	"go.uber.org/config"
)

const ConfigurationKey = "cache"

type Config struct {
	Name string `yaml:"name"`
}

// TODO breadchris break up this config
func NewConfig(config config.Provider) (cfg Config, err error) {
	err = config.Get(ConfigurationKey).Populate(&cfg)
	if err != nil {
		log.Error().Err(err).Msg("failed loading config")
		return
	}
	return
}
