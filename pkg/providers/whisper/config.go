package whisper

import (
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
func NewConfig(config config.Provider) (Config, error) {
	var cfg Config
	err := config.Get(ConfigurationKey).Populate(&cfg)
	if err != nil {
		return Config{}, err
	}
	return cfg, nil
}
