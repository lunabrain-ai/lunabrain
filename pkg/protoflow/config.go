package protoflow

import (
	"github.com/rs/zerolog/log"
	"go.uber.org/config"
)

const ConfigurationKey = "protoflow"

type Config struct{}

func NewDefaultConfig() Config {
	return Config{}
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
