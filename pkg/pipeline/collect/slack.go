package collect

import (
	"github.com/slack-go/slack"
	"log/slog"
)

type Config struct {
	Token string
}

type Bot struct {
	api *slack.Client
}

func NewBot(config Config) *Bot {
	api := slack.New(config.Token)
	return &Bot{api: api}
}

func (b *Bot) ListenAndResponse() {
	rtm := b.api.NewRTM()
	go rtm.ManageConnection()

	for msg := range rtm.IncomingEvents {
		switch ev := msg.Data.(type) {
		case *slack.MessageEvent:
			if ev.BotID != "" {
				continue // skip bot messages
			}
			_, _, err := b.api.PostMessage(ev.Channel, slack.MsgOptionText(ev.Text, false))
			if err != nil {
				slog.Error("failed to post message", "error", err)
			}
		}
	}
}
