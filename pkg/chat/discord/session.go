package discord

import (
	"github.com/bwmarrin/discordgo"
	"github.com/google/wire"
	"github.com/pkg/errors"
	"log/slog"
)

var ProviderSet = wire.NewSet(
	NewConfig,
	NewDiscordSession,
	NewBot,
	NewHandler,
	NewSession,
	New,
)

type Session struct {
	*discordgo.Session
	Messages *PubSub
}

func NewDiscordSession(config Config) (*discordgo.Session, error) {
	if !config.Enabled {
		return nil, nil
	}

	token := "Bot " + config.Token

	s, err := discordgo.New(token)
	if err != nil {
		return nil, errors.Wrapf(err, "failed to create discord session")
	}

	if config.Intent > 0 {
		s.Identify.Intents = config.Intent
	}

	if t, err := ParseToken(token); err != nil {
		slog.Warn("failed to parse discord token, verify token is correct in config", "error", err)
	} else {
		slog.Info("OAuth URL", "url", GenerateOAuthURL(t))
	}
	return s, nil
}

func NewSession(config Config, s *discordgo.Session) (*Session, error) {
	if !config.Enabled {
		slog.Warn("discord is not enabled")
		return nil, nil
	}

	msgs := NewPubSub()

	err := s.Open()
	if err != nil {
		return nil, errors.Wrapf(err, "failed to open discord session")
	}

	sess := &Session{
		Session:  s,
		Messages: msgs,
	}
	sess.LogSessionEvents()
	return sess, nil
}

func (s *Session) LogSessionEvents() {
	s.AddHandler(func(sess *discordgo.Session, m *discordgo.MessageCreate) {
		slog.Info("message create", "content", m.Content)
		s.Messages.Publish(MessageTopic, m)
	})
	//s.AddHandler(func(s *discordgo.Session, r *discordgo.Ready) {
	//	slog.Info("connected", "username", s.State.User.Username, "discriminator", s.State.User.Discriminator)
	//})
	//s.AddHandler(func(s *discordgo.Session, m *discordgo.MessageEdit) {
	//	slog.Info("message edit", "event", m)
	//})
	//s.AddHandler(func(s *discordgo.Session, m *discordgo.MessageDelete) {
	//	slog.Info("message delete", "event", m)
	//})
}
