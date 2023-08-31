package discord

import (
	"context"
	connect_go "github.com/bufbuild/connect-go"
	genapi "github.com/lunabrain-ai/lunabrain/gen"
	"github.com/lunabrain-ai/lunabrain/gen/genconnect"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
)

type DiscordService struct {
	session *Session
}

var _ genconnect.DiscordServiceHandler = (*DiscordService)(nil)

func New(s *Session) *DiscordService {
	// TODO breadchris how do we configure discord to be enabled/disabled? Need some way to guard calls
	return &DiscordService{
		session: s,
	}
}

func (d *DiscordService) ReadMessages(ctx context.Context, c *connect_go.Request[genapi.ReadMessagesRequest], c2 *connect_go.ServerStream[genapi.ReadMessagesResponse]) error {
	// TODO breadchris use a more robust pubsub library that cleans things up correctly https://github.com/juju/pubsub/tree/master
	// TODO breadchris what about different channels?
	for msg := range d.session.Messages.Subscribe(MessageTopic) {
		if msg.Author.Bot {
			continue
		}
		log.Info().Msgf("reading message \"%s\"", msg.Content)
		err := c2.Send(&genapi.ReadMessagesResponse{
			MessageID: msg.ID,
			Content:   msg.Content,
			ChannelID: msg.ChannelID,
		})
		if err != nil {
			return errors.Wrapf(err, "unable to send message")
		}
	}
	return nil
}

func (d *DiscordService) WriteMessage(ctx context.Context, c *connect_go.Request[genapi.WriteMessageRequest]) (*connect_go.Response[genapi.WriteMessageResponse], error) {
	log.Info().Msgf("writing message \"%s\" to channel %s", c.Msg.Content, c.Msg.ChannelID)
	channelID := c.Msg.ChannelID
	msg, err := d.session.ChannelMessageSend(channelID, c.Msg.Content)
	if msg == nil {
		return nil, errors.Wrapf(err, "unable to send message, channelID: %s", channelID)
	}
	return connect_go.NewResponse(&genapi.WriteMessageResponse{
		MessageID: msg.ID,
	}), err
}
