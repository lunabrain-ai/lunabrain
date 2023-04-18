package html

import (
	"bytes"
	"embed"
	"github.com/Masterminds/sprig/v3"
	"github.com/alexferrari88/gohn/pkg/gohn"
	"github.com/jba/templatecheck"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db/model"
	"html/template"
	"io"
)

//go:embed *
var Files embed.FS

func formatName(name string) string {
	return name + ".go.html"
}

type TemplatePage interface {
	Execute(w io.Writer, params interface{}) error
}

var (
	basePatterns = []string{
		"layout.go.html",
		"content.go.html",
		"normalcontent.go.html",
	}
	errorPage = NewPage("error", ErrorParams{}, basePatterns)
)

type Nav struct {
	Name  string
	Route string
}

type Page struct {
	Title string
	Nav   []Nav
	tmpl  *template.Template
}

func NewPage(name string, params interface{}, patterns []string) *Page {
	file := formatName(name)
	patterns = append(patterns, file)

	tmpl := template.Must(
		template.New("layout.go.html").
			Funcs(sprig.FuncMap()).
			ParseFS(Files, patterns...))

	nav := []Nav{
		{Name: "Home", Route: "/"},
		{Name: "Save", Route: "/save"},
		{Name: "Search", Route: "/search"},
		{Name: "HN", Route: "/hn"},
	}

	if err := templatecheck.CheckHTML(tmpl, pageParams(name, nav, params)); err != nil {
		panic(err)
	}

	return &Page{
		Title: name,
		Nav:   nav,
		tmpl:  tmpl,
	}
}

// TODO breadchris why was this written this way? it seems like you should be able to just use a struct
func pageParams(title string, nav []Nav, params interface{}) interface{} {
	type page struct {
		Params interface{}
		Title  string
		Nav    []Nav
	}
	return page{
		Params: params,
		Title:  title,
		Nav:    nav,
	}
}

func (p *Page) Execute(w io.Writer, params interface{}) error {
	out := bytes.Buffer{}
	err := p.tmpl.Execute(&out, pageParams(p.Title, p.Nav, params))
	if err != nil {
		return errorPage.Execute(w, ErrorParams{Message: err.Error()})
	}
	_, err = out.WriteTo(w)
	return err
}

type Story struct {
	model.HNStory
	Item          *gohn.Item
	URLDomain     string
	Summary       string
	Text          string
	Categories    []string
	CommentsCount int
}

type HNParams struct {
	Stories []Story
}

type DiscordParams struct {
	Channels []model.DiscordChannel
}

type SaveParams struct {
	ContentIDs []string
}

type SearchParams struct {
	Results *genapi.Results
}

type ViewParams struct {
	StoredContent *genapi.StoredContent
}

type ErrorParams struct {
	Message string
}

type HomeParams struct{}

type HTML struct {
	Discord *Page
	HN      *Page
	View    *Page
	Search  *Page
	Save    *Page
	Home    *Page
	Error   *Page
}

func (h *HTML) WriteDiscord(w io.Writer, params DiscordParams) error {
	return h.Discord.Execute(w, params)
}

func (h *HTML) WriteHN(w io.Writer, params HNParams) error {
	return h.HN.Execute(w, params)
}

func (h *HTML) WriteView(w io.Writer, params ViewParams) error {
	return h.View.Execute(w, params)
}

func (h *HTML) WriteSearch(w io.Writer, params SearchParams) error {
	return h.Search.Execute(w, params)
}

func (h *HTML) WriteSave(w io.Writer, params SaveParams) error {
	return h.Save.Execute(w, params)
}

func (h *HTML) WriteHome(w io.Writer, params HomeParams) error {
	return h.Home.Execute(w, params)
}

func NewHTML() *HTML {
	return &HTML{
		Discord: NewPage("discord", DiscordParams{}, basePatterns),
		HN:      NewPage("hn", HNParams{}, basePatterns),
		View:    NewPage("view", ViewParams{}, basePatterns),
		Search:  NewPage("search", SearchParams{}, basePatterns),
		Save:    NewPage("save", SaveParams{}, basePatterns),
		Home:    NewPage("home", HomeParams{}, basePatterns),
	}
}
