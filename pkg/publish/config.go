package publish

import (
	"github.com/rs/zerolog/log"
	"go.uber.org/config"
)

const ConfigurationKey = "publish"

type DiscordConfig struct {
	Enabled bool `yaml:"enabled"`

	// TODO breadchris make this configurable outside of a static config
	ChannelID string `yaml:"channel_id"`
}

type Config struct {
	Discord DiscordConfig `yaml:"discord"`
}

func NewConfig(config config.Provider) (cfg Config, err error) {
	err = config.Get(ConfigurationKey).Populate(&cfg)
	if err != nil {
		log.Error().Err(err).Msg("failed loading config")
		return
	}
	return
}
