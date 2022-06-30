package consumers

import (
  "context"
  "github.com/breadchris/sifty/backend/.gen/sifty/public/model"
)

type SlackBookmarkConsumerConfig struct {
}

type SlackBookmarkConsumer struct {
  Config SlackBookmarkConsumerConfig
}

func NewSlackBookmarkConsumer(config SlackBookmarkConsumerConfig) BookmarkConsumer {
  return &SlackBookmarkConsumer{
    Config: config,
  }
}

func (s *SlackBookmarkConsumer) Consume(ctx context.Context, bookmark model.Bookmark) error {
  return nil
}
