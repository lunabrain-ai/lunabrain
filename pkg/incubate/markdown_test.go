package incubate

import "testing"

func TestParseMarkdown(t *testing.T) {
	markdown := []byte("@breadchris This is a test markdown document.")
	parseMarkdown(markdown)
}
