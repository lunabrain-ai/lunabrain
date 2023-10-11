package protoflow

import (
	"go.uber.org/config"
)

const ConfigurationKey = "protoflow"

type Config struct{}

func NewDefaultConfig() Config {
	return Config{}
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
