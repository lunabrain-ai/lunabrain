package chat

import (
	"context"
	"crypto/md5"
	"encoding/binary"
	connect_go "github.com/bufbuild/connect-go"
	petname "github.com/dustinkirkland/golang-petname"
	"github.com/google/wire"
	"github.com/justshare-io/justshare/pkg/gen/chat"
	"github.com/justshare-io/justshare/pkg/gen/chat/chatconnect"
	"github.com/justshare-io/justshare/pkg/http"
	"github.com/justshare-io/justshare/pkg/user"
	"github.com/pkg/errors"
	"io"
	"math/rand"
	"sync"
	"time"
)

type Service struct {
	sess        *http.SessionManager
	user        *user.EntStore
	chat        chan *chat.Message
	subscribers map[chan<- *chat.Message]struct{}
	mu          sync.Mutex
	memUser     func(string) (string, error)
}

var ProviderSet = wire.NewSet(
	New,
)

func New(
	sess *http.SessionManager,
	user *user.EntStore,
) *Service {
	c := make(chan *chat.Message)
	return &Service{
		sess:        sess,
		user:        user,
		chat:        c,
		subscribers: make(map[chan<- *chat.Message]struct{}),
		memUser:     memoizeUsername(),
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

func memoizeUsername() func(string) (string, error) {
	userMap := map[string]string{}
	s := rand.NewSource(int64(42))
	return func(email string) (string, error) {
		if pn, ok := userMap[email]; ok {
			return pn, nil
		}

		h := md5.New()
		_, err := io.WriteString(h, email)
		if err != nil {
			return "", err
		}

		seed := binary.BigEndian.Uint64(h.Sum(nil))
		s.Seed(int64(seed))
		pn := petname.Generate(3, "-")
		userMap[email] = pn
		return pn, nil
	}
}

func (s *Service) SendMessage(ctx context.Context, c *connect_go.Request[chat.SendMessageRequest]) (*connect_go.Response[chat.SendMessageResponse], error) {
	id, err := s.sess.GetUserID(ctx)
	if err != nil {
		return nil, errors.New("you can not send message")
	}

	u, err := s.user.GetUserByID(ctx, id)
	if err != nil {
		return nil, err
	}

	pn, err := s.memUser(u.Email)
	if err != nil {
		return nil, err
	}

	s.broadcastMessage(&chat.Message{
		User:      pn,
		Text:      c.Msg.Message,
		Timestamp: time.Now().Unix(),
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
	defer close(subscriberChan)
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
