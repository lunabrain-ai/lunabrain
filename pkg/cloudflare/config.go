package cloudflare

import (
	"go.uber.org/config"
)

type Config struct {
	Token string `yaml:"token"`
}

func NewDefaultConfig() Config {
	return Config{
		Token: "",
	}
}

func NewConfig(provider config.Provider) (Config, error) {
	value := provider.Get("cloudflare")

	var cfg Config
	err := value.Populate(&cfg)
	if err != nil {
		return Config{}, err
	}
	return cfg, nil
}
