package event

import (
	"go.uber.org/config"
)

type Config struct {
	SaveEvents bool `yaml:"save_events"`
}

func DefaultConfig() Config {
	return Config{
		SaveEvents: false,
	}
}

func NewConfig(provider config.Provider) (Config, error) {
	value := provider.Get("event")

	var cfg Config
	err := value.Populate(&cfg)
	if err != nil {
		return Config{}, err
	}
	return cfg, nil
}
