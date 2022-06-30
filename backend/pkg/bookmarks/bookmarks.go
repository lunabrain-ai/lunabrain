package bookmarks

import (
  "fmt"
  "github.com/breadchris/sifty/backend/pkg/core"
  "github.com/breadchris/sifty/backend/pkg/model"
)

func Download(book *model.Bookmark, dataDir string) (*model.Bookmark, error) {
  content, contentType, err := core.DownloadBookmark(book.URL)
  if err != nil {
    return nil, fmt.Errorf("error downloading bookmark: %s", err)
  }

  processRequest := core.ProcessRequest{
    DataDir:     dataDir,
    Bookmark:    *book,
    Content:     content,
    ContentType: contentType,
  }

  result, isFatalErr, err := core.ProcessBookmark(processRequest)
  content.Close()

  if err != nil && isFatalErr {
    panic(fmt.Errorf("failed to process bookmark: %v", err))
  }

  return &result, err
}
