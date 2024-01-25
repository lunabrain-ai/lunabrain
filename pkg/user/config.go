package user

import (
	"go.uber.org/config"
)

type Config struct {
	RegistrationAllowed string `yaml:"registration_allowed"`
	EmailVerification   string `yaml:"email_verification"`

	SmtpHost     string `yaml:"smtp_host"`
	SmtpPort     string `yaml:"smtp_port"`
	SmtpUsername string `yaml:"smtp_username"`
	SmtpPassword string `yaml:"smtp_password"`

	OfflineVoice string `yaml:"offline_voice"`
}

func DefaultConfig() Config {
	return Config{
		RegistrationAllowed: "true",
		EmailVerification:   "false",
		SmtpHost:            "smtp.gmail.com",
		SmtpPort:            "587",
		OfflineVoice:        "false",
	}
}

func NewConfig(provider config.Provider) (Config, error) {
	value := provider.Get("user")

	var cfg Config
	err := value.Populate(&cfg)
	if err != nil {
		return Config{}, err
	}
	return cfg, nil
}
