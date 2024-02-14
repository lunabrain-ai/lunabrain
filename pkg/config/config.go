package config

import (
	"github.com/justshare-io/justshare/pkg/bucket"
	"github.com/justshare-io/justshare/pkg/content"
	"github.com/justshare-io/justshare/pkg/db"
	"github.com/justshare-io/justshare/pkg/event"
	"github.com/justshare-io/justshare/pkg/providers/openai"
	"github.com/justshare-io/justshare/pkg/providers/whisper"
	"github.com/justshare-io/justshare/pkg/scrape"
	"github.com/justshare-io/justshare/pkg/user"
	"go.uber.org/config"
	"log/slog"
	"os"
	"path"
)

const (
	userConfigDir = ".justshare"
	configDir     = "config/justshare/"
	configFile    = ".justshare.yaml"
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
