package twilio

import (
	"github.com/google/wire"
	"github.com/twilio/twilio-go"
	twilioApi "github.com/twilio/twilio-go/rest/api/v2010"
	"go.uber.org/config"
)

type Config struct {
	AccountSID  string `yaml:"account_sid"`
	AuthToken   string `yaml:"auth_token"`
	PhoneNumber string `yaml:"phone_number"`
}

type TwilioService struct {
	Client      *twilio.RestClient
	PhoneNumber string
}

var ProviderSet = wire.NewSet(
	NewConfig,
	NewTwilio,
)

func NewConfig(config config.Provider) (Config, error) {
	var cfg Config
	err := config.Get("twilio").Populate(&cfg)
	if err != nil {
		return Config{}, err
	}
	return cfg, nil
}

func NewTwilio(config *Config) (*TwilioService, error) {
	client := twilio.NewRestClientWithParams(twilio.ClientParams{
		Username: config.AccountSID,
		Password: config.AuthToken,
	})
	service := &TwilioService{
		Client:      client,
		PhoneNumber: config.PhoneNumber,
	}
	return service, nil
}

func (service *TwilioService) SendMessage(to string, message string) error {
	params := &twilioApi.CreateMessageParams{}
	params.SetTo(to)
	params.SetFrom(service.PhoneNumber)
	params.SetBody(message)

	_, err := service.Client.Api.CreateMessage(params)
	if err != nil {
		return err
	}
	return nil
}
