package processors

import (
  "context"
  "github.com/breadchris/sifty/backend/.gen/sifty/public/model"
)

// TODO (cthompson) these fields should be in the schema
// TODO (cthompson) there should be processor_source_ingress and processor_pile_ingress which are the sources and piles that
// a processor gets data/bookmarks from and processor_pile_egress which are configured piles that a processor will write bookmarks to.

type bookmarkProcessor struct {
  Name     string `json:"name"`
  Schedule string `json:"schedule"`
}

type BookmarkProcessor interface {
  CreateBookmarksAndSaveToPiles(piles []model.Pile) error
  ProcessSource(source model.Source) ([]model.Bookmark, error)
  ProcessPileBookmarks(pileBookmarks []model.Bookmark) ([]model.Bookmark, error)
}

func (s *bookmarkProcessor)
