package content

import (
	"github.com/lunabrain-ai/lunabrain/pkg/util"
	"github.com/pkg/errors"
	"github.com/reactivex/rxgo/v2"
	"log/slog"
	"testing"
)

func TestParseMarkdown(t *testing.T) {
	_, err := parseMarkdown("/Users/hacked/Documents/Github/notes/journals/2024_01_07.md")
	if err != nil {
		t.Fatal(err)
	}
}

func TestParseMarkdownDir(t *testing.T) {
	obs := util.WalkDirectory("/Users/hacked/Documents/Github/notes/journals", ".md")
	<-obs.FlatMap(func(item rxgo.Item) rxgo.Observable {
		return rxgo.Just(errors.New("not a string"))()
	}).
		ForEach(func(v any) {
			return
		}, func(err error) {
			slog.Error("error parsing logseq", err)
		}, func() {
			slog.Info("done")
		})
}
