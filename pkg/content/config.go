package content

import (
	"go.uber.org/config"
)

type Config struct {
	Port        string `yaml:"port"`
	StudioProxy string `yaml:"studio_proxy"`
}

func NewConfig(provider config.Provider) (Config, error) {
	value := provider.Get("service")

	var cfg Config
	err := value.Populate(&cfg)
	if err != nil {
		return Config{}, err
	}
	return cfg, nil
}
