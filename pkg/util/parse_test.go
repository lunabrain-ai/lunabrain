package util

import (
	"os"
	"testing"
)

func TestParseFile(t *testing.T) {
	file := "/Users/hacked/Documents/GitHub/justshare/js/site/form/walk.ts"
	sourceCode, err := os.ReadFile(file)
	if err != nil {
		t.Errorf("os.ReadFile() error = %v", err)
	}
	tree, err := ParseFile(file)
	if err != nil {
		t.Errorf("ParseFile() error = %v", err)
	}
	if tree == nil {
		t.Errorf("ParseFile() tree = nil")
	}
	rn := tree.RootNode()
	if rn == nil {
		t.Errorf("ParseFile() tree.RootNode() = nil")
	}
	walkTree(sourceCode, rn, 0)

	//screamingSnakeCasePattern := `(
	//	(identifier) @identifier
	//)`
	//
	//q, _ := sitter.NewQuery([]byte(screamingSnakeCasePattern), typescript.GetLanguage())
	//qc := sitter.NewQueryCursor()
	//qc.Exec(q, rn)
	//// Iterate over query results
	//for {
	//	m, ok := qc.NextMatch()
	//	if !ok {
	//		break
	//	}
	//	// Apply predicates filtering
	//	m = qc.FilterPredicates(m, sourceCode)
	//	for _, c := range m.Captures {
	//		fmt.Println(c.Node.Content(sourceCode))
	//	}
	//}
}
