package config

import (
	"github.com/lunabrain-ai/lunabrain/pkg/api"
	"github.com/lunabrain-ai/lunabrain/pkg/openai"
	"github.com/lunabrain-ai/lunabrain/pkg/protoflow"
	"github.com/lunabrain-ai/lunabrain/pkg/python"
	"github.com/lunabrain-ai/lunabrain/pkg/scrape"
	"github.com/lunabrain-ai/lunabrain/pkg/store/bucket"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/lunabrain-ai/lunabrain/pkg/whisper"
	"github.com/rs/zerolog/log"
	"go.uber.org/config"
	"io/ioutil"
	"os"
	"path"
)

const (
	userConfigDir = ".lunabrain"
	configDir     = "config/lunabrain/"
	configFile    = ".lunabrain.yaml"
)

type Config struct {
	Bucket    bucket.Config    `yaml:"bucket"`
	Python    python.Config    `yaml:"python"`
	API       api.Config       `yaml:"api"`
	Scrape    scrape.Config    `yaml:"scrape"`
	DB        db.Config        `yaml:"db"`
	OpenAI    openai.Config    `yaml:"openai"`
	Protoflow protoflow.Config `yaml:"protoflow"`
	Whisper   whisper.Config   `yaml:"config"`
}

func newDefaultConfig() Config {
	return Config{
		Bucket: bucket.Config{
			LocalName: userConfigDir,
			Path:      "",
			// TODO breadchris this will break if the port is changed in the API config
			URLBase: "localhost:8080/bucket",
		},
		Python: python.Config{
			Host: "localhost:50051",
		},
		API: api.Config{
			Port: "8080",
		},
		Scrape: scrape.Config{
			Client: scrape.ClientHTTP,
		},
		DB:        db.NewDefaultConfig(),
		OpenAI:    openai.NewDefaultConfig(),
		Protoflow: protoflow.NewDefaultConfig(),
		Whisper:   whisper.NewDefaultConfig(),
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
			// do not add to opts if file is not *.yaml
			if path.Ext(file.Name()) != ".yaml" {
				continue
			}
			opts = append(opts, config.File(path.Join(configDir, file.Name())))
		}
	}
	if err != nil {
		log.Warn().Str("config directory", configDir).Msg("unable to locate config directory")
	}

	if f, ferr := os.Stat(configFile); ferr == nil {
		log.Info().
			Str("config file", configFile).
			Msg("using local config file")
		opts = append(opts, config.File(path.Join(f.Name())))
	}

	return config.NewYAML(opts...)
}
