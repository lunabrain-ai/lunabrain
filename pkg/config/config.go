package config

import (
	"github.com/lunabrain-ai/lunabrain/pkg/bucket"
	"github.com/lunabrain-ai/lunabrain/pkg/content"
	"github.com/lunabrain-ai/lunabrain/pkg/db"
	"github.com/lunabrain-ai/lunabrain/pkg/openai"
	"github.com/lunabrain-ai/lunabrain/pkg/protoflow"
	"github.com/lunabrain-ai/lunabrain/pkg/scrape"
	"github.com/lunabrain-ai/lunabrain/pkg/whisper"
	"go.uber.org/config"
	"io/ioutil"
	"log/slog"
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
	Service   content.Config   `yaml:"api"`
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
			// TODO breadchris this will break if the port is changed in the Service config
			URLBase: "localhost:8080/bucket",
		},
		Service: content.Config{
			Port: "8000",
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
		slog.Warn("unable to locate config directory", "config directory", configDir)
	}

	if f, ferr := os.Stat(configFile); ferr == nil {
		slog.Info("using local config file", "config file", configFile)
		opts = append(opts, config.File(path.Join(f.Name())))
	}

	return config.NewYAML(opts...)
}
