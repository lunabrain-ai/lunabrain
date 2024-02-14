package normalize

import (
	"github.com/go-shiori/go-readability"
	"github.com/justshare-io/justshare/pkg/gen/content"
	"time"
)

func (s *Normalize) articleURL(ul string) ([]*content.Content, error) {
	var nCnt []*content.Content

	article, err := readability.FromURL(ul, 30*time.Second)
	if err != nil {
		return nil, err
	}

	nCnt = append(nCnt, &content.Content{
		Tags: []string{},
		Type: &content.Content_Normalized{
			Normalized: &content.Normalized{
				Type: &content.Normalized_Article{
					Article: &content.Article{
						Title:    article.Title,
						Author:   article.Byline,
						Length:   int32(article.Length),
						Excerpt:  article.Excerpt,
						SiteName: article.SiteName,
						Image:    article.Image,
						Favicon:  article.Favicon,
						Text:     article.TextContent,
					},
				},
			},
		},
	})
	return nCnt, nil
}
