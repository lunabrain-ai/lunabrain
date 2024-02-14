package bot

import (
	"github.com/bwmarrin/discordgo"
	util2 "github.com/justshare-io/justshare/pkg/chat/discord/util"
	"github.com/justshare-io/justshare/pkg/db"
	"github.com/justshare-io/justshare/pkg/db/model"
	"log/slog"
)

type Discord struct {
	session *discordgo.Session
	db      *db.GormStore
}

func (c *Discord) Collect(channelID string) ([]*model.DiscordMessage, error) {
	var (
		msgs []*model.DiscordMessage
		err  error
	)

	// TODO breadchris configure to collect or use existing messages
	if false {
		//latest, _ := c.db.GetLatestDiscordMessage()
		//
		//var afterID string
		//if latest != nil {
		//	afterID = latest.MessageID
		//}
		// TODO breadchris there will be a retroactive collection and a forward collection

		msgs, err = c.getHistoricalChannelMessages(channelID)
		if err != nil {
			return nil, err
		}

		if len(msgs) == 0 {
			slog.Debug("no messages to collect", "channelID", channelID)
			return nil, nil
		}

		err = c.db.StoreDiscordMessages(msgs)
		if err != nil {
			return nil, err
		}
	} else {
		msgs, err = c.db.GetDiscordMessages(channelID)
		if err != nil {
			return nil, err
		}
	}

	err = c.createTranscripts(channelID, msgs)
	if err != nil {
		return nil, err
	}
	return msgs, nil
}

func (c *Discord) createTranscripts(channelID string, msgs []*model.DiscordMessage) error {
	var transMsgs []*model.DiscordMessage
	for _, msg := range msgs {
		transMsgs = append(transMsgs, msg)

		// TODO breadchris how many messages should be in a transcript?
		if len(transMsgs) == 100 {
			startMessage := msgs[0]
			endMessage := msgs[len(msgs)-1]

			transcript := util2.GenerateTranscript(transMsgs)

			// TODO breadchris associate transcript to content
			err := c.db.StoreDiscordTranscript(
				channelID,
				startMessage.MessageID,
				endMessage.MessageID,
				transcript,
			)
			if err != nil {
				return err
			}

			// TODO breadchris process transcript
		}
	}
	return nil
}

// TODO breadchris discord starts with the latest message in the channel, so there will be a retroactive collection and a forward collection
func (c *Discord) getHistoricalChannelMessages(channelID string) ([]*model.DiscordMessage, error) {
	// Get the messages from the channel
	slog.Debug("getting discord messages", "channelID", channelID)
	messages, err := c.session.ChannelMessages(channelID, 100, "", "", "")
	if err != nil {
		return nil, err
	}

	if len(messages) == 0 {
		return nil, nil
	}

	// Loop through all the messages until we get all of them
	oldestMsgID := ""
	for {
		// Set the last ID to the last message ID we received
		oldestMsgID = messages[len(messages)-1].ID

		// Get the next set of messages using the last ID
		slog.Debug("getting more discord messages", "oldestMsgID", oldestMsgID)
		moreMessages, err := c.session.ChannelMessages(channelID, 100, oldestMsgID, "", "")
		if err != nil {
			return nil, err
		}

		// Append the new messages to the existing messages slice
		messages = append(messages, moreMessages...)
		slog.Debug("total messages collected", "count", len(messages))

		// Check if we have all the messages
		if len(moreMessages) < 100 {
			break
		}
	}

	var returnMessages []*model.DiscordMessage
	for _, msg := range messages {
		returnMessages = append(returnMessages, &model.DiscordMessage{
			MessageID:        msg.ID,
			DiscordChannelID: msg.ChannelID,
			AuthorID:         msg.Author.ID,
			Timestamp:        msg.Timestamp,
			Content:          msg.Content,
		})
	}

	return returnMessages, nil
}

func NewDiscord(session *discordgo.Session, db *db.GormStore) *Discord {
	return &Discord{
		session: session,
		db:      db,
	}
}
