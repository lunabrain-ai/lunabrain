package bucket

import (
	"github.com/rs/zerolog/log"
	"go.uber.org/config"
)

const ConfigurationKey = "bucket"

type Config struct {
	LocalName string `yaml:"local_name"`
	Path      string `yaml:"path"`
	URLBase   string `yaml:"url_base"`
}

func NewConfig(config config.Provider) (cfg Config, err error) {
	err = config.Get(ConfigurationKey).Populate(&cfg)
	if err != nil {
		log.Error().Err(err).Msg("failed loading config")
		return
	}
	return
}
