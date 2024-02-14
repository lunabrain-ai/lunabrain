package publish

import (
	"encoding/json"
	"fmt"
	md "github.com/JohannesKaufmann/html-to-markdown"
	"github.com/gosimple/slug"
	"github.com/justshare-io/justshare/pkg/bucket"
	"github.com/justshare-io/justshare/pkg/gen/content"
	"github.com/justshare-io/justshare/pkg/publish/templates"
	"github.com/justshare-io/justshare/pkg/util"
	"gopkg.in/yaml.v3"
	"os"
	"os/exec"
	"path"
	"strings"
	"time"
)

type Blog struct {
}

type BlogSection struct {
	Section *content.Section
	Posts   []*content.Content
}

func NewBlog() *Blog {
	return &Blog{}
}

func (s *Blog) Publish(b *bucket.Builder, site *content.Site, sections []BlogSection) error {
	sd, err := b.Build()
	if err != nil {
		return err
	}
	if err = util.RemoveAllFilesInDir(sd); err != nil {
		return err
	}

	converter := md.NewConverter("", true, nil)

	cDir, err := b.Dir("content").Build()
	if err != nil {
		return err
	}
	for _, sec := range sections {
		if sec.Section.Menu == nil {
			continue
		}

		// TODO breadchris express this more robustly
		writeFile := func(name string, data []byte) error {
			dir := cDir
			if len(sec.Posts) > 1 {
				dir, err = b.Dir(path.Join("content", strings.ToLower(sec.Section.Menu.Name))).Build()
				if err != nil {
					return err
				}
			}
			return os.WriteFile(path.Join(dir, name), data, 0644)
		}

		for _, c := range sec.Posts {
			switch t := c.Type.(type) {
			case *content.Content_Post:
				markdown, err := converter.ConvertString(t.Post.Content)
				if err != nil {
					return err
				}
				d, err := time.Parse(time.RFC3339, c.CreatedAt)
				if err != nil {
					return err
				}
				sb, err := marshalArticleWithContent(Article{
					Author: t.Post.Authors,
					Title:  t.Post.Title,
					Tags:   c.Tags,
					Date: ArticleTime{
						Time: d,
					},
				}, markdown)
				if err != nil {
					return err
				}

				sl := slug.Make(t.Post.Title)
				// TODO breadchris make this the slug
				if err = writeFile(sl+".md", []byte(sb)); err != nil {
					return err
				}
			}
		}
	}

	for lang, lc := range site.HugoConfig.Languages {
		if lang != "en" {
			continue
		}
		for _, sec := range sections {
			lc.Menu["main"].Items = append(lc.Menu["main"].Items, &content.MenuItem{
				Name: sec.Section.Menu.Name,
				Url:  path.Join("/", strings.ToLower(sec.Section.Menu.Name)),
			})
		}
	}

	td, err := b.Dir("themes").Build()
	if err != nil {
		return err
	}
	if err = util.CopyDir(templates.FS, "papermod", td); err != nil {
		return err
	}

	jsonBytes, err := json.Marshal(site.HugoConfig)
	if err != nil {
		return fmt.Errorf("error serializing HugoConfig to JSON: %w", err)
	}

	var deserializedMap map[string]any
	err = json.Unmarshal(jsonBytes, &deserializedMap)
	if err != nil {
		return fmt.Errorf("error deserializing JSON to map: %w", err)
	}

	nc := util.SnakeToCamelCase(deserializedMap)

	o, err := yaml.Marshal(nc)
	if err != nil {
		return err
	}

	if err = os.WriteFile(path.Join(sd, "config.yaml"), o, 0644); err != nil {
		return err
	}

	if err = runHugo(sd); err != nil {
		return err
	}

	return nil
}

func marshalArticleWithContent(article Article, content string) (string, error) {
	yamlData, err := yaml.Marshal(article)
	if err != nil {
		return "", err
	}

	var sb strings.Builder
	sb.WriteString("---\n")
	sb.Write(yamlData)
	sb.WriteString("---\n\n")
	sb.WriteString(content)

	return sb.String(), nil
}

// TODO breadchris figure out how to run hugo from go
func runHugo(dir string) error {
	cmd := exec.Command("hugo")
	cmd.Dir = dir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}
