package content

import (
	"github.com/rs/zerolog/log"
	"go.uber.org/config"
)

type Config struct {
	Port        string `yaml:"port"`
	StudioProxy string `yaml:"studio_proxy"`
}

func NewConfig(provider config.Provider) (config Config, err error) {
	value := provider.Get("service")

	err = value.Populate(&config)
	if err != nil {
		log.Error().
			Err(err).
			Msg("unable populate openai config")
		return
	}
	return
}
