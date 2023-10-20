package content

import (
	"github.com/go-git/go-git/v5"
	"github.com/go-shiori/go-readability"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/gen/content"
	"github.com/lunabrain-ai/lunabrain/pkg/bucket"
	"log/slog"
	"net/url"
	"os"
	"path"
	"strings"
	"time"
)

type Normalize struct {
	bucket *bucket.Builder
}

func NewNormalize(b *bucket.Builder) *Normalize {
	return &Normalize{
		bucket: b,
	}
}

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

func findRepoReadme(dir string) (string, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return "", err
	}

	for _, entry := range entries {
		if !entry.IsDir() && strings.EqualFold(entry.Name(), "README.md") {
			return path.Join(dir, entry.Name()), nil
		}
	}
	return "", nil
}

func (s *Normalize) gitURL(ul string) ([]*content.Content, error) {
	var nCnt []*content.Content

	id := uuid.NewString()
	gitDir, err := s.bucket.Dir(id).Build()
	if err != nil {
		return nil, err
	}
	slog.Debug("cloning git repo", "url", ul, "dir", gitDir)
	_, err = git.PlainClone(gitDir, false, &git.CloneOptions{
		URL:               ul,
		RecurseSubmodules: git.DefaultSubmoduleRecursionDepth,
		Depth:             1,
	})
	if err != nil {
		return nil, err
	}

	readme, err := findRepoReadme(gitDir)
	if err != nil {
		return nil, err
	}
	if readme != "" {
		data, err := os.ReadFile(readme)
		if err != nil {
			return nil, err
		}
		nCnt = append(nCnt, &content.Content{
			Tags: []string{},
			Uri:  readme,
			Type: &content.Content_Normalized{
				Normalized: &content.Normalized{
					Type: &content.Normalized_Readme{
						Readme: &content.ReadMe{
							Data: string(data),
						},
					},
				},
			},
		})
	}

	// TODO breadchris this is a little noisy, add this back when it is more purposeful
	//l := source.NewLogSeq()
	//obs := l.Load(gitDir)
	//
	//// Subscribe and print URLs and tags
	//<-obs.ForEach(func(i any) {
	//	tl, ok := i.(source.TaggedLink)
	//	if !ok {
	//		slog.Error("error casting to TaggedLink", "error", ok)
	//		return
	//	}
	//	slog.Info("result", "result", tl)
	//	nCnt = append(nCnt, &content.Content{
	//		Tags: tl.Tags,
	//		Uri:  tl.File,
	//		Type: &content.Content_Data{
	//			Data: &content.Data{
	//				Type: &content.Data_Url{
	//					Url: &content.URL{
	//						Url: tl.URL,
	//					},
	//				},
	//			},
	//		},
	//	})
	//}, func(err error) {
	//	slog.Error("error while extracting", "error", err)
	//}, func() {
	//	slog.Debug("extraction complete")
	//})
	return nCnt, nil
}

func (s *Normalize) Normalize(c *content.Content) ([]*content.Content, error) {
	var nCnt []*content.Content
	switch t := c.Type.(type) {
	case *content.Content_Data:
		switch u := t.Data.Type.(type) {
		case *content.Data_Url:
			ul := u.Url.Url
			_, err := url.Parse(ul)
			if err != nil {
				return nil, err
			}

			// TODO breadchris some domain specific logic is a nice to have
			//if strings.HasSuffix(parsed.Path, ".git") {
			//	return s.gitURL(ul)
			//}
			return s.articleURL(ul)
		}
	}
	return nCnt, nil
}
