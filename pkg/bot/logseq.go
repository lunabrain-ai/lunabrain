package bot

import (
	"bufio"
	"context"
	"github.com/reactivex/rxgo/v2"
	"mvdan.cc/xurls/v2"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

type LogSeq struct {
}

func NewLogSeq() *LogSeq {
	return &LogSeq{}
}

// walkDirectory walks a directory and emits markdown file paths to an Observable.
func walkDirectory(dir string) rxgo.Observable {
	return rxgo.Create([]rxgo.Producer{func(ctx context.Context, next chan<- rxgo.Item) {
		_ = filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if !info.IsDir() && filepath.Ext(path) == ".md" {
				next <- rxgo.Of(path)
			}
			return nil
		})
	}})
}

type TaggedLink struct {
	File string
	Tags []string
	URL  string
}

var (
	lineRe = regexp.MustCompile(`^(\s*)- .+`)
	tagRe  = regexp.MustCompile(`(?:\s|^)(#\w+(?:/\w+)?)(?:\s|$)`)
)

func cleanTag(s string) string {
	s = strings.TrimSpace(s)
	if strings.HasPrefix(s, "#") {
		s = s[1:]
	}
	return s
}

// parseMarkdown reads and parses the markdown content of a given file path, then extracts URLs and tags.
func parseMarkdown(filePath string) ([]TaggedLink, error) {
	content, err := os.Open(filePath)
	if err != nil {
		return nil, err
	}

	var results []TaggedLink
	rxStrict := xurls.Strict()

	scanner := bufio.NewScanner(content)
	for scanner.Scan() {
		if !lineRe.MatchString(scanner.Text()) {
			continue
		}

		line := scanner.Text()
		matches := rxStrict.FindAllString(line, -1)

		if len(matches) > 0 {
			tags := tagRe.FindAllString(line, -1)
			var cleanedTags []string
			for _, tag := range tags {
				cleanedTags = append(cleanedTags, cleanTag(tag))
			}
			for _, url := range matches {
				results = append(results, TaggedLink{URL: url, Tags: cleanedTags, File: filePath})
			}
		}
	}

	if scanner.Err() != nil {
		return nil, scanner.Err()
	}
	return results, nil
}

func (s *LogSeq) Load(dir string) rxgo.Observable {
	observable := walkDirectory(dir)

	// Parse markdown and extract URLs and tags
	return observable.
		FlatMap(func(item rxgo.Item) rxgo.Observable {
			filePath := item.V.(string)
			extracted, err := parseMarkdown(filePath)
			if err != nil {
				return nil
			}
			return rxgo.Just(extracted)()
		}, rxgo.WithPool(5))
}
