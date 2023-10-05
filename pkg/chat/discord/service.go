package discord

import (
	"context"
	connect_go "github.com/bufbuild/connect-go"
	"github.com/lunabrain-ai/lunabrain/gen/chat"
	"github.com/lunabrain-ai/lunabrain/gen/chat/chatconnect"
	"github.com/pkg/errors"
	"log/slog"
)

type DiscordService struct {
	session *Session
}

var _ chatconnect.DiscordServiceHandler = (*DiscordService)(nil)

func New(s *Session) *DiscordService {
	// TODO breadchris how do we configure discord to be enabled/disabled? Need some way to guard calls
	return &DiscordService{
		session: s,
	}
}

func (d *DiscordService) ReadMessages(ctx context.Context, c *connect_go.Request[chat.ReadMessagesRequest], c2 *connect_go.ServerStream[chat.ReadMessagesResponse]) error {
	// TODO breadchris use a more robust pubsub library that cleans things up correctly https://github.com/juju/pubsub/tree/master
	// TODO breadchris what about different channels?
	for msg := range d.session.Messages.Subscribe(MessageTopic) {
		if msg.Author.Bot {
			continue
		}
		slog.Info("reading message", "content", msg.Content)
		err := c2.Send(&chat.ReadMessagesResponse{
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

func (d *DiscordService) WriteMessage(ctx context.Context, c *connect_go.Request[chat.WriteMessageRequest]) (*connect_go.Response[chat.WriteMessageResponse], error) {
	slog.Info("writing message", "content", c.Msg.Content, "channelID", c.Msg.ChannelID)
	channelID := c.Msg.ChannelID
	msg, err := d.session.ChannelMessageSend(channelID, c.Msg.Content)
	if msg == nil {
		return nil, errors.Wrapf(err, "unable to send message, channelID: %s", channelID)
	}
	return connect_go.NewResponse(&chat.WriteMessageResponse{
		MessageID: msg.ID,
	}), err
}
