package normalize

import (
	"go.uber.org/config"
)

type URLConfig struct {
	DomainContent bool `yaml:"domain_content"`
}

type Config struct {
	URL URLConfig `yaml:"url"`
}

func NewConfig(provider config.Provider) (Config, error) {
	value := provider.Get("normalize")

	var cfg Config
	err := value.Populate(&cfg)
	if err != nil {
		return Config{}, err
	}
	return cfg, nil
}
