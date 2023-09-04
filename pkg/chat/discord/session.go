package discord

import (
	"github.com/bwmarrin/discordgo"
	"github.com/google/wire"
	"github.com/rs/zerolog/log"
)

var ProviderSet = wire.NewSet(
	NewConfig,
	NewDiscordSession,
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
		log.Warn().Msg("discord is not enabled")
		return nil, nil
	}

	token := "Bot " + config.Token

	s, err := discordgo.New(token)
	if err != nil {
		log.Error().Err(err).Msg("failed to create discord session")
		return nil, err
	}

	if config.Intent > 0 {
		s.Identify.Intents = config.Intent
	}

	if t, err := ParseToken(token); err != nil {
		log.Warn().Err(err).Msg("failed to parse discord token, verify token is correct in config")
	} else {
		log.Info().Str("url", GenerateOAuthURL(t)).Msg("OAuth URL")
	}
	return s, nil
}

func NewSession(config Config, s *discordgo.Session) (*Session, error) {
	if !config.Enabled {
		log.Warn().Msg("discord is not enabled")
		return nil, nil
	}

	msgs := NewPubSub()

	err := s.Open()
	if err != nil {
		log.Error().Err(err).Msg("failed to open discord session")
		return nil, err
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
		log.Info().
			Interface("event", m).
			Msg("message create")
		s.Messages.Publish(MessageTopic, m)
	})
	s.AddHandler(func(s *discordgo.Session, r *discordgo.Ready) {
		log.Info().
			Str("username", s.State.User.Username).
			Str("discriminator", s.State.User.Discriminator).
			Msg("connected")
	})
	s.AddHandler(func(s *discordgo.Session, m *discordgo.MessageEdit) {
		log.Info().
			Interface("event", m).
			Msg("message edit")
	})
	s.AddHandler(func(s *discordgo.Session, m *discordgo.MessageDelete) {
		log.Info().
			Interface("event", m).
			Msg("message delete")
	})
	s.AddHandler(func(s *discordgo.Session, m *discordgo.PresenceUpdate) {
		log.Info().
			Interface("event", m).
			Msg("presence update")
	})
}
