package chat

import (
	"context"
	connect_go "github.com/bufbuild/connect-go"
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/chat"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/chat/chatconnect"
	"github.com/lunabrain-ai/lunabrain/pkg/http"
	"github.com/pkg/errors"
	"sync"
	"time"
)

type Service struct {
	sess        *http.SessionManager
	chat        chan *chat.Message
	subscribers map[chan<- *chat.Message]struct{}
	mu          sync.Mutex
}

var ProviderSet = wire.NewSet(
	New,
)

func New(
	sess *http.SessionManager,
) *Service {
	c := make(chan *chat.Message)
	return &Service{
		sess:        sess,
		chat:        c,
		subscribers: make(map[chan<- *chat.Message]struct{}),
	}
}

var _ chatconnect.ChatServiceHandler = (*Service)(nil)

func (s *Service) addSubscriber(ch chan<- *chat.Message) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.subscribers[ch] = struct{}{}
}

func (s *Service) removeSubscriber(ch chan<- *chat.Message) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.subscribers, ch)
}

func (s *Service) broadcastMessage(msg *chat.Message) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for ch := range s.subscribers {
		ch <- msg
	}
}

func (s *Service) BanUser(ctx context.Context, c *connect_go.Request[chat.BanUserRequest]) (*connect_go.Response[chat.BanUserResponse], error) {
	if _, err := s.sess.GetUserID(ctx); err != nil {
		return nil, errors.New("you can not ban")
	}
	_ = c.Header().Get("x-forwarded-for")
	return connect_go.NewResponse(&chat.BanUserResponse{}), nil
}

func (s *Service) SendMessage(ctx context.Context, c *connect_go.Request[chat.SendMessageRequest]) (*connect_go.Response[chat.SendMessageResponse], error) {
	s.broadcastMessage(&chat.Message{
		User:      c.Msg.User,
		Text:      c.Msg.Message,
		Timestamp: time.Now().Unix(),
		Css:       c.Msg.Css,
	})
	return connect_go.NewResponse(&chat.SendMessageResponse{}), nil
}

func (s *Service) ReceiveMessages(ctx context.Context, c *connect_go.Request[chat.ReceiveMessagesRequest], c2 *connect_go.ServerStream[chat.Message]) error {
	err := c2.Send(&chat.Message{
		User:      "system",
		Text:      "you have joined!",
		Timestamp: 0,
	})
	if err != nil {
		return err
	}
	subscriberChan := make(chan *chat.Message)
	s.addSubscriber(subscriberChan)
	defer s.removeSubscriber(subscriberChan)

	for {
		select {
		case <-ctx.Done():
			return nil
		case msg := <-subscriberChan:
			if err = c2.Send(msg); err != nil {
				return err
			}
		}
	}
}
