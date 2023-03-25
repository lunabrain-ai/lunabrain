package config

import (
	"github.com/lunabrain-ai/lunabrain/pkg/api"
	"github.com/lunabrain-ai/lunabrain/pkg/openai"
	"github.com/lunabrain-ai/lunabrain/pkg/python"
	"github.com/rs/zerolog/log"
	"go.uber.org/config"
	"io/ioutil"
	"os"
	"path"
)

const configDir = "config/lunabrain/"

const lunabrainConfigDir = ".lunabrain.yaml"

type Config struct {
	Python python.Config `yaml:"python"`
	OpenAI openai.Config `yaml:"openai"`
	API    api.Config    `yaml:"api"`
}

func newDefaultConfig() Config {
	return Config{
		Python: python.Config{
			Host: "localhost:50051",
		},
		OpenAI: openai.Config{
			APIKey: "${LUNABRAIN_OPENAI_API_KEY}",
		},
		API: api.Config{
			Port:  "8080",
			Local: false,
		},
	}
}

func NewConfigProvider() (config.Provider, error) {
	opts := []config.YAMLOption{
		config.Permissive(),
		config.Expand(os.LookupEnv),
		config.Static(newDefaultConfig()),
	}

	files, err := ioutil.ReadDir(configDir)
	if err == nil {
		for _, file := range files {
			opts = append(opts, config.File(path.Join(configDir, file.Name())))
		}
	}
	if err != nil {
		log.Warn().Str("config directory", configDir).Msg("unable to locate config directory")
	}

	if f, ferr := os.Stat(lunabrainConfigDir); ferr == nil {
		log.Info().
			Str("config file", lunabrainConfigDir).
			Msg("using local config file")
		opts = append(opts, config.File(path.Join(f.Name())))
	}

	return config.NewYAML(opts...)
}
