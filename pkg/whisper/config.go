package whisper

import (
	"github.com/rs/zerolog/log"
	"go.uber.org/config"
)

const ConfigurationKey = "whisper"

type Config struct {
	Offline bool `yaml:"offline"`
}

func NewDefaultConfig() Config {
	return Config{
		Offline: true,
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
