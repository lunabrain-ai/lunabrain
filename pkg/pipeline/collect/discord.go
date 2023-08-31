package collect

import (
	"context"
	"github.com/bwmarrin/discordgo"
	genapi "github.com/lunabrain-ai/lunabrain/gen"
	util2 "github.com/lunabrain-ai/lunabrain/pkg/chat/discord/util"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db/model"
	"github.com/rs/zerolog/log"
)

type DiscordCollector struct {
	session  *discordgo.Session
	workflow pipeline.Workflow
	db       db.Store
}

func (c *DiscordCollector) Collect(channelID string) ([]*model.DiscordMessage, error) {
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
			log.Debug().Str("channelID", channelID).Msg("no messages to collect")
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

func (c *DiscordCollector) createTranscripts(channelID string, msgs []*model.DiscordMessage) error {
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
			_, err = c.workflow.ProcessContent(context.Background(), &genapi.Content{
				Data: []byte(transcript),
				Type: genapi.ContentType_TEXT,
			})
		}
	}
	return nil
}

// TODO breadchris discord starts with the latest message in the channel, so there will be a retroactive collection and a forward collection
func (c *DiscordCollector) getHistoricalChannelMessages(channelID string) ([]*model.DiscordMessage, error) {
	// Get the messages from the channel
	log.Debug().Str("channelID", channelID).Msg("getting discord messages")
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
		log.Debug().Str("oldestMsgID", oldestMsgID).Msg("getting more discord messages")
		moreMessages, err := c.session.ChannelMessages(channelID, 100, oldestMsgID, "", "")
		if err != nil {
			return nil, err
		}

		// Append the new messages to the existing messages slice
		messages = append(messages, moreMessages...)
		log.Debug().Int("count", len(messages)).Msg("total messages collected")

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

func NewDiscordCollector(session *discordgo.Session, db db.Store, workflow pipeline.Workflow) *DiscordCollector {
	return &DiscordCollector{
		workflow: workflow,
		session:  session,
		db:       db,
	}
}
