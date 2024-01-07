package incubate

import (
	"bytes"
	"fmt"
	"github.com/yuin/goldmark"
	"github.com/yuin/goldmark/ast"
	"github.com/yuin/goldmark/text"
)

func parseMarkdown(markdown []byte) {
	// Create a new markdown parser
	md := goldmark.New()

	// Parse the markdown file
	doc := md.Parser().Parse(text.NewReader(markdown))

	// Traverse the AST
	ast.Walk(doc, func(n ast.Node, entering bool) (ast.WalkStatus, error) {
		if entering {
			switch n := n.(type) {
			case *ast.Text:
				if bytes.Contains(n.Text(markdown), []byte("@breadchris")) {
					fmt.Println("breadchris")
				}
			}
		}
		return ast.WalkContinue, nil
	})
}
