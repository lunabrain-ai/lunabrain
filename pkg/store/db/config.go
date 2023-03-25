package db

import (
	"github.com/rs/zerolog/log"
	"go.uber.org/config"
)

type Config struct {
	DSN  string `yaml:"dsn"`
	Type string `yaml:"type"`
}

func NewConfig(provider config.Provider) (config Config, err error) {
	value := provider.Get("db")

	err = value.Populate(&config)
	if err != nil {
		log.Error().
			Err(err).
			Msg("unable populate openai config")
		return
	}
	return
}
