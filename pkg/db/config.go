package db

import (
	"go.uber.org/config"
)

type Config struct {
	DSN   string `yaml:"dsn"`
	Type  string `yaml:"type"`
	Debug bool   `yaml:"debug"`

	Bucket                       string `yaml:"bucket"`
	BackupName                   string `yaml:"backup_name"`
	Endpoint                     string `yaml:"endpoint"`
	AwsAccessKeyID               string `yaml:"aws_access_key_id"`
	AwsSecretAccessKey           string `yaml:"aws_secret_access_key"`
	GoogleApplicationCredentials string `yaml:"google_application_credentials"`

	BackupsEnabled bool
	BackupsConfig  string `yaml:"backups"`
}

func NewDefaultConfig() Config {
	return Config{
		DSN:   "${DSN:\"file:data/lunabrain.db?_fk=1\"}",
		Type:  "sqlite3",
		Debug: false,

		Bucket:                       "${BUCKET:\"lunabrain\"}",
		BackupName:                   "${BACKUP_NAME:\"lunabrain\"}",
		Endpoint:                     "${ENDPOINT:\"http://localhost:9000\"}",
		AwsAccessKeyID:               "${AWS_ACCESS_KEY_ID:\"minio\"}",
		AwsSecretAccessKey:           "${AWS_SECRET_ACCESS_KEY:\"minio123\"}",
		GoogleApplicationCredentials: "${GOOGLE_APPLICATION_CREDENTIALS:\"\"}",

		BackupsEnabled: false,
		BackupsConfig:  "${BACKUPS:\"false\"}",
	}
}

func NewConfig(provider config.Provider) (Config, error) {
	value := provider.Get("db")

	var c Config
	err := value.Populate(&c)
	if err != nil {
		return Config{}, err
	}
	// TODO breadchris this parsing should happen automatically, but you can't declare a bool in env
	c.BackupsEnabled = c.BackupsConfig == "true"
	return c, nil
}
