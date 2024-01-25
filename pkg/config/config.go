package config

import (
	"github.com/lunabrain-ai/lunabrain/pkg/bucket"
	"github.com/lunabrain-ai/lunabrain/pkg/content"
	"github.com/lunabrain-ai/lunabrain/pkg/db"
	"github.com/lunabrain-ai/lunabrain/pkg/event"
	"github.com/lunabrain-ai/lunabrain/pkg/openai"
	"github.com/lunabrain-ai/lunabrain/pkg/scrape"
	"github.com/lunabrain-ai/lunabrain/pkg/user"
	"github.com/lunabrain-ai/lunabrain/pkg/whisper"
	"go.uber.org/config"
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
	Bucket  bucket.Config  `yaml:"bucket"`
	Service content.Config `yaml:"service"`
	Scrape  scrape.Config  `yaml:"scrape"`
	DB      db.Config      `yaml:"db"`
	OpenAI  openai.Config  `yaml:"openai"`
	Whisper whisper.Config `yaml:"config"`
	User    user.Config    `yaml:"user"`
	Event   event.Config   `yaml:"event"`
}

func newDefaultConfig() Config {
	return Config{
		Bucket:  bucket.NewDefaultConfig(),
		Service: content.NewDefaultConfig(),
		Scrape: scrape.Config{
			Client: scrape.ClientHTTP,
		},
		DB:      db.NewDefaultConfig(),
		OpenAI:  openai.NewDefaultConfig(),
		Whisper: whisper.NewDefaultConfig(),
		User:    user.DefaultConfig(),
		Event:   event.DefaultConfig(),
	}
}

func NewConfigProvider() (config.Provider, error) {
	opts := []config.YAMLOption{
		config.Permissive(),
		config.Expand(os.LookupEnv),
		config.Static(newDefaultConfig()),
	}

	files, err := os.ReadDir(configDir)
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

	cf := configFile
	if lc := os.Getenv("CONFIG"); lc != "" {
		cf = lc
	}
	if f, ferr := os.Stat(cf); ferr == nil {
		slog.Info("using local config file", "config file", configFile)
		opts = append(opts, config.File(path.Join(f.Name())))
	}

	return config.NewYAML(opts...)
}
