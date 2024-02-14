package content

import (
	"github.com/lunabrain-ai/lunabrain/pkg/gen/content"
	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/ast"
	"github.com/yuin/goldmark/text"
	"os"
	"regexp"
	"strings"
)

// parseMarkdown parses a markdown file for search, case-insensitive
func parseMarkdown(path string) ([]*content.Content, error) {
	markdown, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	md := goldmark.New()
	doc := md.Parser().Parse(text.NewReader(markdown))

	tagRegexp := regexp.MustCompile("(?i)^#100daystooffload$")

	//doc.Dump(markdown, 2)

	var enumCnt []*content.Content
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
						sb := strings.Builder{}
						if err = md.Renderer().Render(&sb, markdown, cnt); err != nil {
							return ast.WalkStop, err
						}
						enumCnt = append(enumCnt, NewTextContent(path, sb.String(), []string{"100daystooffload"}))
					}
				}
			}
		}
		return ast.WalkContinue, nil
	})
	if err != nil {
		return nil, err
	}
	return enumCnt, nil
}
