package html

import (
	"bytes"
	"embed"
	"github.com/Masterminds/sprig/v3"
	"github.com/jba/templatecheck"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
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
	patterns = []string{
		"layout.go.html",
		"content.go.html",
		"normalcontent.go.html",
	}
	errorPage = NewPage("error", ErrorParams{}, patterns)
)

type Page struct {
	Title string
	tmpl  *template.Template
}

func NewPage(name string, params interface{}, patterns []string) *Page {
	file := formatName(name)
	patterns = append(patterns, file)

	tmpl := template.Must(
		template.New("layout.go.html").
			Funcs(sprig.FuncMap()).
			ParseFS(Files, patterns...))

	if err := templatecheck.CheckHTML(tmpl, pageParams(name, params)); err != nil {
		panic(err)
	}

	return &Page{
		Title: name,
		tmpl:  tmpl,
	}
}

func pageParams(title string, params interface{}) interface{} {
	type page struct {
		Params interface{}
		Title  string
	}
	return page{
		Params: params,
		Title:  title,
	}
}

func (p *Page) Execute(w io.Writer, params interface{}) error {
	out := bytes.Buffer{}
	err := p.tmpl.Execute(&out, pageParams(p.Title, params))
	if err != nil {
		return errorPage.Execute(w, ErrorParams{Message: err.Error()})
	}
	_, err = out.WriteTo(w)
	return err
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
	View   *Page
	Search *Page
	Save   *Page
	Home   *Page
	Error  *Page
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
		View:   NewPage("view", ViewParams{}, patterns),
		Search: NewPage("search", SearchParams{}, patterns),
		Save:   NewPage("save", SaveParams{}, patterns),
		Home:   NewPage("home", HomeParams{}, patterns),
	}
}
