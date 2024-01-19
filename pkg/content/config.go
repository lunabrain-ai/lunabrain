package content

import (
	"go.uber.org/config"
)

type Config struct {
	Port               string `yaml:"port"`
	Proxy              string `yaml:"proxy"`
	SessionSecret      string `yaml:"session_secret"`
	GoogleClientID     string `yaml:"google_client_id"`
	GoogleClientSecret string `yaml:"google_client_secret"`
	ExternalURL        string `yaml:"external_url"`
}

func NewDefaultConfig() Config {
	return Config{
		Port:  "${PORT:\"8000\"}",
		Proxy: "${PROXY:\"\"}",
		// TODO breadchris this should be something else
		SessionSecret: "test",
	}
}

func NewConfig(provider config.Provider) (Config, error) {
	value := provider.Get("service")

	var cfg Config
	err := value.Populate(&cfg)
	if err != nil {
		return Config{}, err
	}
	return cfg, nil
}
