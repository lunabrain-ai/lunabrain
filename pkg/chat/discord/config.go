package discord

import (
	"github.com/bwmarrin/discordgo"
	"go.uber.org/config"
)

const ConfigurationKey = "discord"

type Config struct {
	Enabled       bool             `yaml:"enabled"`
	ApplicationID string           `yaml:"application_id"`
	Token         string           `yaml:"token"`
	Intent        discordgo.Intent `yaml:"intent"`
}

func NewConfig(config config.Provider) (Config, error) {
	var cfg Config
	err := config.Get(ConfigurationKey).Populate(&cfg)
	if err != nil {
		return Config{}, err
	}
	return cfg, nil
}
