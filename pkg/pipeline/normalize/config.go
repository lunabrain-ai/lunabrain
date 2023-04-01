package normalize

import (
	"github.com/rs/zerolog/log"
	"go.uber.org/config"
)

type URLConfig struct {
	DomainContent bool `yaml:"domain_content"`
}

type Config struct {
	URL URLConfig `yaml:"url"`
}

func NewConfig(provider config.Provider) (config Config, err error) {
	value := provider.Get("normalize")

	err = value.Populate(&config)
	if err != nil {
		log.Error().
			Err(err).
			Msg("unable populate normalize config")
		return
	}
	return
}
