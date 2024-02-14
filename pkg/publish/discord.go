package publish

import (
	"github.com/google/uuid"
	"github.com/justshare-io/justshare/pkg/chat/discord"
	"github.com/justshare-io/justshare/pkg/db"
	"github.com/justshare-io/justshare/pkg/db/model"
	"log/slog"
)

type DiscordConfig struct {
	Enabled bool `yaml:"enabled"`

	// TODO breadchris make this configurable outside of a static config
	ChannelID string `yaml:"channel_id"`
}

type Discord struct {
	session *discord.Session
	config  DiscordConfig
	db      *db.GormStore
}

func formatMsg(c *model.Content) string {
	// TODO breadchris for message summaries, this will be too much data
	formatted := "Data: " + c.Data.String() + "\n"
	return formatted
}

func (d *Discord) Publish(contentID uuid.UUID) error {
	if !d.config.Enabled {
		slog.Debug("content publishing to discord disabled", "contentID", contentID.String())
		return nil
	}

	slog.Debug("publishing content to discord", "contentID", contentID.String())

	//content, err := d.db.Get(contentID)
	//if err != nil {
	//	return errors.Wrapf(err, "failed to get content by id %s", contentID)
	//}
	//
	//msg := formatMsg(content)
	//slog.Debug("publishing discord message", "msg", msg)
	//
	//_, err = d.session.ChannelMessageSend(d.config.ChannelID, msg)
	//if err != nil {
	//	return errors.Wrapf(err, "failed to send message to channel %s", d.config.ChannelID)
	//}
	return nil
}

func NewDiscord(session *discord.Session, config Config, db *db.GormStore) *Discord {
	if config.Discord.ChannelID == "" {
		slog.Warn("discord channel id not set, publishing to discord disabled")
		config.Discord.Enabled = false
	}
	d := &Discord{
		session: session,
		config:  config.Discord,
		db:      db,
	}
	return d
}
