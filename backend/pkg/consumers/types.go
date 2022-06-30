package consumers

import (
  "context"
  "github.com/breadchris/sifty/backend/.gen/sifty/public/model"
)

type BookmarkConsumer interface {
  Consume(ctx context.Context, bookmark model.Bookmark) error
}
