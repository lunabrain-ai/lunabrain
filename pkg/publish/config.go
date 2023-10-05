package publish

import (
	"go.uber.org/config"
)

const ConfigurationKey = "publish"

type Config struct {
	Discord DiscordConfig `yaml:"discord"`
	File    FileConfig    `yaml:"file"`
}

// TODO breadchris break up this config
func NewConfig(config config.Provider) (Config, error) {
	var cfg Config
	err := config.Get(ConfigurationKey).Populate(&cfg)
	if err != nil {
		return Config{}, err
	}
	return cfg, nil
}
