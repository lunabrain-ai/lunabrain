package normalize

import (
	"github.com/lunabrain-ai/lunabrain/gen/content"
	"github.com/lunabrain-ai/lunabrain/pkg/bucket"
	"net/url"
)

type Normalize struct {
	bucket *bucket.Builder
}

func NewNormalize(b *bucket.Builder) *Normalize {
	return &Normalize{
		bucket: b,
	}
}

func (s *Normalize) Normalize(c *content.Content) ([]*content.Content, []string, error) {
	var nCnt []*content.Content
	switch t := c.Type.(type) {
	case *content.Content_Data:
		switch u := t.Data.Type.(type) {
		case *content.Data_Url:
			ul := u.Url.Url
			pUrl, err := url.Parse(ul)
			if err != nil {
				return nil, nil, err
			}

			tags := []string{
				pUrl.Host,
			}

			if pUrl.Host == "chat.openai.com" {
				cnt, err := s.chatgptContent(ul)
				if err != nil {
					return nil, nil, err
				}
				return cnt, tags, nil
			}

			// TODO breadchris some domain specific logic is a nice to have
			//if strings.HasSuffix(parsed.Path, ".git") {
			//	return s.gitURL(ul)
			//}

			cnt, err := s.articleURL(ul)
			if err != nil {
				return nil, nil, err
			}
			return cnt, tags, nil
		}
	}
	return nCnt, []string{}, nil
}
