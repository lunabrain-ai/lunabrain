package discord

import (
	"context"
	"fmt"
	"github.com/bwmarrin/discordgo"
	"github.com/justshare-io/justshare/pkg/providers/openai"
	"log/slog"
)

const (
	questionOption    = "question"
	descriptionOption = "description"
	defaultPersona    = "You are the most interesting man in the world."
)

type Bot struct {
	openai        *openai.Agent
	personaLookup map[string]string
}

func NewBot(openai *openai.Agent) *Bot {
	return &Bot{
		openai:        openai,
		personaLookup: map[string]string{},
	}
}

func (b *Bot) PersonaCmd(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate) {
	slog.Debug("persona command", "options", i.ApplicationCommandData().Options)
	options := i.ApplicationCommandData().Options
	optionMap := make(map[string]*discordgo.ApplicationCommandInteractionDataOption, len(options))
	for _, opt := range options {
		optionMap[opt.Name] = opt
	}

	desc := ""
	if option, ok := optionMap[descriptionOption]; ok {
		desc = option.StringValue()
		b.personaLookup[i.Interaction.ChannelID] = desc
	}
	err := s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseDeferredChannelMessageWithSource,
	})
	if err != nil {
		slog.Error("failed to acknowledge persona command", "error", err)
		return
	}
	answer := "ok!"
	_, err = s.InteractionResponseEdit(i.Interaction, &discordgo.WebhookEdit{
		Content: &answer,
	})
	if err != nil {
		slog.Error("failed to acknowledge persona command", "error", err)
		return
	}
}

func (b *Bot) AskCmd(ctx context.Context, s *discordgo.Session, i *discordgo.InteractionCreate) {
	slog.Debug("ask command", "options", i.ApplicationCommandData().Options)
	options := i.ApplicationCommandData().Options
	optionMap := make(map[string]*discordgo.ApplicationCommandInteractionDataOption, len(options))
	for _, opt := range options {
		optionMap[opt.Name] = opt
	}

	question := ""
	if option, ok := optionMap[questionOption]; ok {
		question = option.StringValue()
	}
	err := s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseDeferredChannelMessageWithSource,
	})
	if err != nil {
		slog.Error("failed to acknowledge ask command", "error", err)
		return
	}
	answer := "hold up..."
	_, err = s.InteractionResponseEdit(i.Interaction, &discordgo.WebhookEdit{
		Content: &answer,
	})

	persona := defaultPersona
	if p, ok := b.personaLookup[i.Interaction.ChannelID]; ok {
		persona = p
	}

	answer, err = b.openai.Prompt(ctx, fmt.Sprintf("%s Answer this question: %s", persona, question))
	if err != nil {
		slog.Error("failed to respond to ask command", "error", err)
		answer = "whups, something went wrong"
		_, err = s.InteractionResponseEdit(i.Interaction, &discordgo.WebhookEdit{
			Content: &answer,
		})
		return
	}
	_, err = s.InteractionResponseEdit(i.Interaction, &discordgo.WebhookEdit{
		Content: &answer,
	})
	if err != nil {
		slog.Error("failed to respond to ask command", "error", err)
		return
	}
}
