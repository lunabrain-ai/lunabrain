package discord

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/rs/zerolog/log"
)

type MessageInfo struct {
	IsBotCommand bool
}

type MessageHandlerFunc func(ctx context.Context, info MessageInfo, s *discordgo.Session, m *discordgo.MessageCreate)
type CommandHandlerFunc func(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate)

type MessageHandler struct {
	Handler MessageHandlerFunc
}

type CommandHandler struct {
	Command          discordgo.ApplicationCommand
	Handler          CommandHandlerFunc
	MessageComponent bool
	GuildID          string
}

type Handler struct {
	config  Config
	msgHdlr []*MessageHandler
	cmds    []*CommandHandler
	cmdStr  string
	cmdMap  map[string]CommandHandlerFunc
	session *discordgo.Session
}

func NewHandler(config Config, session *discordgo.Session) *Handler {
	cmdStr := fmt.Sprintf("<@%s>", config.ApplicationID)

	handlers := []*MessageHandler{
		{
			Handler: func(ctx context.Context, info MessageInfo, s *discordgo.Session, m *discordgo.MessageCreate) {
				if info.IsBotCommand {
					_, _ = s.ChannelMessageSend(m.ChannelID, "pong")
				}
			},
		},
	}

	commands := []*CommandHandler{
		{
			Command: discordgo.ApplicationCommand{
				Name: "ping",
				Type: discordgo.ChatApplicationCommand,
			},
		},
	}

	handlerMap := make(map[string]CommandHandlerFunc)
	for _, cmd := range commands {
		handlerMap[cmd.Command.Name] = cmd.Handler
	}

	return &Handler{
		config:  config,
		session: session,
		msgHdlr: handlers,
		cmds:    commands,
		cmdStr:  cmdStr,
		cmdMap:  handlerMap,
	}
}

func (d *Handler) setupHandlers() error {
	d.session.AddHandler(func(s *discordgo.Session, m *discordgo.MessageCreate) {
		ctx, cancel := context.WithTimeout(context.Background(), time.Second*15)
		defer cancel()

		info := MessageInfo{
			IsBotCommand: strings.Contains(m.Content, d.cmdStr),
		}

		if info.IsBotCommand {
			m.Content = strings.Replace(m.Content, d.cmdStr, "", 1)
		}

		for _, h := range d.msgHdlr {
			h.Handler(ctx, info, s, m)
		}
	})

	d.session.AddHandler(func(s *discordgo.Session, i *discordgo.InteractionCreate) {
		ctx, cancel := context.WithTimeout(context.Background(), time.Second*15)
		defer cancel()

		switch i.Type {
		case discordgo.InteractionApplicationCommand:
			log.Info().
				Str("handlerName", i.ApplicationCommandData().Name).
				Msg("invoking command handler")
			if h, ok := d.cmdMap[i.ApplicationCommandData().Name]; ok {
				h(ctx, s, i)
			}
		case discordgo.InteractionMessageComponent:
			customID := i.MessageComponentData().CustomID
			log.Info().
				Str("customID", customID).
				Msg("invoking message component handler")
			if h, ok := d.cmdMap[customID]; ok {
				h(ctx, s, i)
			}
		}
	})

	for _, v := range d.cmds {
		if v.MessageComponent {
			continue
		}

		ccmd, err := d.session.ApplicationCommandCreate(d.config.ApplicationID, v.GuildID, &v.Command)
		if err != nil {
			log.Error().Err(err).Msg("failed to register command")
			return err
		}
		log.Info().
			Str("name", ccmd.Name).
			Str("id", ccmd.ID).
			Msg("registered command")
	}
	return nil
}
