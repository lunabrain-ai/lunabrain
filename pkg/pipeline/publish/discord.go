package publish

import (
	"github.com/bwmarrin/discordgo"
	"github.com/google/uuid"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db/model"
	"github.com/pkg/errors"
)

type Discord struct {
	session *discordgo.Session
	config  DiscordConfig
	db      db.Store
}

func formatMsg(content *model.Content) string {
	formatted := "URL: " + content.Data
	for _, normalContent := range content.NormalizedContent {
		if normalContent.NormalizerID == int32(genapi.NormalizerID_TEXT_SUMMARY) {
			formatted += "\nSummary: " + normalContent.Data
		}
	}
	return formatted
}

func (d *Discord) Publish(contentID uuid.UUID) error {
	if !d.config.Enabled {
		return nil
	}

	content, err := d.db.GetContentByID(contentID)
	if err != nil {
		return errors.Wrapf(err, "failed to get content by id %s", contentID)
	}

	msg := formatMsg(content)
	_, err = d.session.ChannelMessageSend(d.config.ChannelID, msg)
	if err != nil {
		return errors.Wrapf(err, "failed to send message to channel %s", d.config.ChannelID)
	}
	return nil
}

func NewDiscord(session *discordgo.Session, config Config, db db.Store) *Discord {
	return &Discord{
		session: session,
		config:  config.Discord,
		db:      db,
	}
}
