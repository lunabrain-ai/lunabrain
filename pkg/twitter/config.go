package twitter

import (
	"go.uber.org/config"
)

type Config struct {
	SecretKey string `yaml:"secret_key"`
}

func NewDefaultConfig() Config {
	return Config{}
}

func NewConfig(provider config.Provider) (Config, error) {
	value := provider.Get("twitter")

	var cfg Config
	err := value.Populate(&cfg)
	if err != nil {
		return Config{}, err
	}
	return cfg, nil
}
