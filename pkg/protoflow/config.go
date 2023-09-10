package protoflow

import (
	"github.com/rs/zerolog/log"
	"go.uber.org/config"
)

const ConfigurationKey = "protoflow"

type Config struct {
	SystemAudio bool `yaml:"system_audio"`
}

func NewDefaultConfig() Config {
	return Config{
		SystemAudio: false,
	}
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
