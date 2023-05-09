package api

import (
	"github.com/rs/zerolog/log"
	"go.uber.org/config"
)

type Config struct {
	Port string `yaml:"port"`
}

func NewConfig(provider config.Provider) (config Config, err error) {
	value := provider.Get("api")

	err = value.Populate(&config)
	if err != nil {
		log.Error().
			Err(err).
			Msg("unable populate openai config")
		return
	}
	return
}
