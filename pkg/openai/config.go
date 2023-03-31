package openai

import (
	"github.com/rs/zerolog/log"
	"go.uber.org/config"
)

type Config struct {
	APIKey string `yaml:"api_key"`
}

func NewConfig(provider config.Provider) (config Config, err error) {
	value := provider.Get("openai")

	err = value.Populate(&config)
	if err != nil {
		log.Error().
			Err(err).
			Msg("unable populate openai config")
		return
	}
	return
}
