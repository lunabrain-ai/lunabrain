package db

import (
	"go.uber.org/config"
)

type Config struct {
	DSN   string `yaml:"dsn"`
	Type  string `yaml:"type"`
	Debug bool   `yaml:"debug"`
}

func NewDefaultConfig() Config {
	return Config{
		DSN:   "lunabrain.db",
		Type:  "sqlite3",
		Debug: false,
	}
}

func NewConfig(provider config.Provider) (Config, error) {
	value := provider.Get("db")

	var cfg Config
	err := value.Populate(&cfg)
	if err != nil {
		return Config{}, err
	}
	return cfg, nil
}
