package publish

import "time"

type ArticleTime struct {
	time.Time
}

// MarshalYAML implements the yaml.Marshaler interface for ArticleTime.
func (t ArticleTime) MarshalYAML() (interface{}, error) {
	return t.Format("2006-01-02"), nil
}

// Article represents the YAML structure of an article.
type Article struct {
	Author      []string    `yaml:"author"`
	Title       string      `yaml:"title"`
	Date        ArticleTime `yaml:"date"`
	Description string      `yaml:"description"`
	Summary     string      `yaml:"summary"`
	Tags        []string    `yaml:"tags"`
	Categories  []string    `yaml:"categories"`
	Series      []string    `yaml:"series"`
	ShowToc     bool        `yaml:"ShowToc"`
	TocOpen     bool        `yaml:"TocOpen"`
}
