package normalize

import (
	"github.com/go-git/go-git/v5"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/gen/content"
	"log/slog"
	"os"
	"path"
	"strings"
)

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
