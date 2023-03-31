package collect

import (
	"github.com/bwmarrin/discordgo"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/lunabrain-ai/lunabrain/pkg/util"
	"github.com/rs/zerolog/log"
)

type DiscordCollector struct {
	session *discordgo.Session
	db      db.Store
}

func (c *DiscordCollector) Collect(channelID string) ([]*discordgo.Message, error) {
	latest, _ := c.db.GetLatestDiscordTranscript()
	// TODO breadchris handle error?

	var afterID string
	if latest != nil {
		afterID = latest.EndMessageID
	}

	msgs, err := c.getChannelMessages(channelID, afterID)
	if err != nil {
		return nil, err
	}

	if len(msgs) == 0 {
		log.Debug().Str("channelID", channelID).Msg("no messages to collect")
		return nil, nil
	}

	err = c.db.StoreDiscordMessages(msgs)
	if err != nil {
		return nil, err
	}
	return msgs, nil
}

func (c *DiscordCollector) getChannelMessages(channelID, afterID string) ([]*discordgo.Message, error) {
	// Get the messages from the channel
	messages, err := c.session.ChannelMessages(channelID, 100, "", afterID, "")
	if err != nil {
		return nil, err
	}

	if len(messages) == 0 {
		return messages, nil
	}

	// Loop through all the messages until we get all of them
	lastID := ""
	for {
		// Set the last ID to the last message ID we received
		lastID = messages[len(messages)-1].ID

		// Get the next set of messages using the last ID
		moreMessages, err := c.session.ChannelMessages(channelID, 100, lastID, "", "")
		if err != nil {
			return nil, err
		}

		util.ReverseSlice[*discordgo.Message](moreMessages)

		// Append the new messages to the existing messages slice
		messages = append(messages, moreMessages...)
		log.Debug().Int("count", len(messages)).Msg("total messages collected")

		// Check if we have all the messages
		if len(moreMessages) < 100 {
			break
		}
	}

	return messages, nil
}

func NewDiscordCollector(session *discordgo.Session, db db.Store) *DiscordCollector {
	return &DiscordCollector{
		session: session,
		db:      db,
	}
}
