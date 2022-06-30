package processors

import (
  "context"
  "github.com/breadchris/sifty/backend/.gen/sifty/public/model"
)

type FerretBookmarkProcessorConfig struct {
  FqlScript string `json:"fql_script"`
}

type FerretBookmarkProcessor struct {
  bookmarkProcessor
  Config FerretBookmarkProcessorConfig
}

func NewFerretBookmarkProcessor(name string, config FerretBookmarkProcessorConfig) BookmarkProcessor {
  return &FerretBookmarkProcessor{
    bookmarkProcessor: bookmarkProcessor{
      Name: name,
    },
    Config: config,
  }
}

func (s *FerretBookmarkProcessor) Process(ctx context.Context, bookmark model.Bookmark) error {
  return nil
}
