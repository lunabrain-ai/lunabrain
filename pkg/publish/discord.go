package publish

import (
	"github.com/bwmarrin/discordgo"
	"github.com/google/uuid"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db/model"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
)

type Discord struct {
	session *discordgo.Session
	config  DiscordConfig
	db      db.Store
}

func formatMsg(content *model.Content) string {
	// TODO breadchris for message summaries, this will be too much data
	formatted := "" // "Data: " + content.Data + "\n"
	for _, normalContent := range content.NormalizedContent {
		for _, transformedContent := range normalContent.TransformedContent {
			if transformedContent.TransformerID == int32(genapi.TransformerID_SUMMARY) {
				formatted += "Summary: " + transformedContent.Data + "\n"
			}
			if transformedContent.TransformerID == int32(genapi.TransformerID_CATEGORIES) {
				formatted += "Categories: " + transformedContent.Data + "\n"
			}
		}
	}
	return formatted
}

func (d *Discord) Publish(contentID uuid.UUID) error {
	if !d.config.Enabled {
		log.Debug().
			Str("contentID", contentID.String()).
			Msg("content publishing to discord disabled")
		return nil
	}

	log.Debug().
		Str("contentID", contentID.String()).
		Msg("publishing content to discord")

	content, err := d.db.GetContentByID(contentID)
	if err != nil {
		return errors.Wrapf(err, "failed to get content by id %s", contentID)
	}

	msg := formatMsg(content)
	log.Debug().Str("msg", msg).Msg("publishing discord message")

	_, err = d.session.ChannelMessageSend(d.config.ChannelID, msg)
	if err != nil {
		return errors.Wrapf(err, "failed to send message to channel %s", d.config.ChannelID)
	}
	return nil
}

func NewDiscord(session *discordgo.Session, config Config, db db.Store) *Discord {
	if config.Discord.ChannelID == "" {
		log.Warn().Msg("discord channel id not set, publishing to discord disabled")
		config.Discord.Enabled = false
	}

	return &Discord{
		session: session,
		config:  config.Discord,
		db:      db,
	}
}
