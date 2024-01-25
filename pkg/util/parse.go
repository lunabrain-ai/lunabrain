package util

import (
	"context"
	"fmt"
	sitter "github.com/smacker/go-tree-sitter"
	"github.com/smacker/go-tree-sitter/golang"
	"github.com/smacker/go-tree-sitter/javascript"
	"github.com/smacker/go-tree-sitter/typescript/typescript"
	"os"
	"path/filepath"
)

func ParseFile(file string) (*sitter.Tree, error) {
	parser := sitter.NewParser()

	// based on the extension, change language
	ext := filepath.Ext(file)
	var lang *sitter.Language
	switch ext {
	case ".js":
		lang = javascript.GetLanguage()
	case ".ts":
		lang = typescript.GetLanguage()
	case ".go":
		lang = golang.GetLanguage()
	default:
		return nil, fmt.Errorf("unknown file extension: %s", ext)
	}
	parser.SetLanguage(lang)

	sourceCode, err := os.ReadFile(file)
	if err != nil {
		return nil, err
	}
	return parser.ParseCtx(context.Background(), nil, sourceCode)
}

func walkTree(input []byte, node *sitter.Node, depth int) {
	indent := ""
	for i := 0; i < depth; i++ {
		indent += "  "
	}

	c := node.Content(input)
	fmt.Printf("%s%s\t%s\n", indent, node.Type(), c)
	for i := 0; i < int(node.ChildCount()); i++ {
		walkTree(input, node.Child(i), depth+1)
	}
}
