package discord

import (
	"github.com/bwmarrin/discordgo"
	"github.com/rs/zerolog/log"
	"go.uber.org/config"
)

const ConfigurationKey = "discord"

type Config struct {
	Enabled       bool             `yaml:"enabled"`
	ApplicationID string           `yaml:"application_id"`
	Token         string           `yaml:"token"`
	Intent        discordgo.Intent `yaml:"intent"`
}

func NewConfig(config config.Provider) (cfg Config, err error) {
	err = config.Get(ConfigurationKey).Populate(&cfg)
	if err != nil {
		log.Error().Err(err).Msg("failed loading config")
		return
	}
	return
}
