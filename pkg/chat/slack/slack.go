package slack

import (
	"github.com/slack-go/slack"
)

func NewSlackClient(token string) (*slack.Client, error) {
	client := slack.New(token)
	_, err := client.AuthTest()
	if err != nil {
		return nil, err
	}
	return client, nil
}

func NewSlackMessageCollector(client *slack.Client, channel string) *SlackMessageCollector {
	return &SlackMessageCollector{
		Client:  client,
		Channel: channel,
	}
}

type SlackMessageCollector struct {
	Client  *slack.Client
	Channel string
}

func (c *SlackMessageCollector) Collect() ([]string, error) {
	params := &slack.GetConversationHistoryParameters{
		ChannelID: c.Channel,
	}
	history, err := c.Client.GetConversationHistory(params)
	if err != nil {
		return nil, err
	}

	messages := make([]string, 0, len(history.Messages))
	for _, message := range history.Messages {
		if message.Type == "message" {
			messages = append(messages, message.Text)
		}
	}

	return messages, nil
}
