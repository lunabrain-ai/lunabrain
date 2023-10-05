package log

import "go.uber.org/config"

type Config struct {
	Level string `yaml:"level"`
}

func NewDefaultConfig() Config {
	return Config{
		Level: "${LOG_LEVEL:info}",
	}
}

func NewConfig(provider config.Provider) (Config, error) {
	var c Config
	err := provider.Get("log").Populate(&c)
	if err != nil {
		return Config{}, err
	}
	return c, nil
}
