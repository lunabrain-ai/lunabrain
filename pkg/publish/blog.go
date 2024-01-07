package publish

import (
	"github.com/lunabrain-ai/lunabrain/pkg/bucket"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/content"
	"github.com/lunabrain-ai/lunabrain/pkg/publish/templates"
	"github.com/lunabrain-ai/lunabrain/pkg/publish/templates/papermod"
	"github.com/lunabrain-ai/lunabrain/pkg/util"
	"github.com/pkg/errors"
	"github.com/reactivex/rxgo/v2"
	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/ast"
	"github.com/yuin/goldmark/text"
	"gopkg.in/yaml.v3"
	"log/slog"
	"os"
	"os/exec"
	"path"
	"regexp"
	"strings"
)

type Blog struct {
	b *bucket.Builder
}

func NewBlog(
	b *bucket.Builder,
) *Blog {
	return &Blog{
		b: b,
	}
}

func parseMarkdown(path string) error {
	markdown, err := os.ReadFile(path)
	if err != nil {
		return err
	}

	md := goldmark.New()
	doc := md.Parser().Parse(text.NewReader(markdown))

	tagRegexp := regexp.MustCompile("(?i)^#100daystooffload$")

	//doc.Dump(markdown, 2)

	var foundCnt []ast.Node
	err = ast.Walk(doc, func(node ast.Node, entering bool) (ast.WalkStatus, error) {
		if !entering {
			return ast.WalkContinue, nil
		}
		switch n := node.(type) {
		case *ast.ListItem:
			if tb, ok := n.FirstChild().(*ast.TextBlock); ok && tb != nil {
				if t, ok := tb.FirstChild().(*ast.Text); ok && t != nil {
					v := t.Segment.Value(markdown)
					if !tagRegexp.Match(v) {
						return ast.WalkContinue, nil
					}
					if cnt, ok := tb.NextSibling().(*ast.List); ok && cnt != nil {
						foundCnt = append(foundCnt, cnt)
					}
				}
			}
		}
		return ast.WalkContinue, nil
	})
	if err != nil {
		return err
	}

	for _, item := range foundCnt {
		md.Renderer().Render(os.Stdout, markdown, item)
	}
	return nil
}

// TODO breadchris hugo to folder
func (s *Blog) Publish(name string, cnt []*content.Content) error {
	// parse notes for #100daystounload, case-insensitive
	obs := util.WalkDirectory("/Users/hacked/Documents/Github/notes/journals", ".md")
	<-obs.FlatMap(func(item rxgo.Item) rxgo.Observable {
		if p, ok := item.V.(string); ok {
			err := parseMarkdown(p)
			if err != nil {
				return rxgo.Just(err)()
			}
			return rxgo.Just("")()
		}
		return rxgo.Just(errors.New("not a string"))()
	}).
		ForEach(func(v any) {
			return
		}, func(err error) {
			slog.Error("error parsing logseq", err)
		}, func() {
			slog.Info("done")
		})

	d := s.b.Dir(name)
	sd, err := d.Build()
	if err != nil {
		return err
	}
	if err = util.RemoveAllFilesInDir(sd); err != nil {
		return err
	}

	td, err := d.Dir("themes").Build()
	if err != nil {
		return err
	}
	if err = util.CopyDir(templates.FS, "papermod", td); err != nil {
		return err
	}

	// TODO breadchris get external URL
	c := papermod.New("http://localhost:8000/@breadchris")
	o, err := yaml.Marshal(c)
	if err != nil {
		return err
	}

	if err = os.WriteFile(path.Join(sd, "config.yaml"), o, 0644); err != nil {
		return err
	}

	posts, err := d.Dir("content/posts").Build()
	if err != nil {
		return err
	}
	for _, c := range cnt {
		switch t := c.Type.(type) {
		case *content.Content_Data:
			switch u := t.Data.Type.(type) {
			case *content.Data_Text:
				sb, err := marshalArticleWithContent(Article{}, u.Text.Data)
				if err != nil {
					return err
				}
				if err = os.WriteFile(path.Join(posts, c.Id+".md"), []byte(sb), 0644); err != nil {
					return err
				}
			}
		}
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
