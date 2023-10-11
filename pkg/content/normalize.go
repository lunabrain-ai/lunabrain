package content

import (
	"github.com/go-shiori/go-readability"
	"github.com/lunabrain-ai/lunabrain/gen/content"
	"time"
)

func Normalize(c *content.Content) ([]*content.Content, error) {
	var nCnt []*content.Content
	switch t := c.Type.(type) {
	case *content.Content_Data:
		switch u := t.Data.Type.(type) {
		case *content.Data_Url:
			article, err := readability.FromURL(u.Url.Url, 30*time.Second)
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
		}
	}
	return nCnt, nil
}
