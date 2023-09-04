package server

import (
	"context"
	"encoding/json"
	connect_go "github.com/bufbuild/connect-go"
	"github.com/go-chi/chi/v5"
	genapi "github.com/lunabrain-ai/lunabrain/gen"
	"github.com/lunabrain-ai/lunabrain/pkg/server/html"
	"github.com/mingrammer/commonregex"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
)

func getFileData(r *http.Request) (string, []byte) {
	formFile, header, err := r.FormFile("file")
	if err != nil {
		log.Warn().Msg("no audio file available")
		return "", nil
	}
	defer formFile.Close()

	// Read the audio file contents into a byte slice
	fileData, err := io.ReadAll(formFile)
	if err != nil {
		log.Warn().Msg("Failed to read audio file")
		return "", nil
	}
	return header.Filename, fileData
}

func serverError(w http.ResponseWriter, err error) {
	log.Error().Msgf("Server error: %+v", err)
	http.Error(w, err.Error(), http.StatusInternalServerError)
}

func (a *APIHTTPServer) getClientRoutes(r chi.Router) {
	r.Get("/hn", func(w http.ResponseWriter, r *http.Request) {
		stories, err := a.db.GetTopHNStories()
		if err != nil {
			serverError(w, err)
			return
		}

		var htmlStories []html.Story
		for _, story := range stories {
			commentsCount := len(story.Comments.Data)

			urlDomain := ""
			if story.URL != "" {
				storyURL, err := url.Parse(story.URL)
				if err == nil {
					urlDomain = storyURL.Host
				}
			}
			s := html.Story{
				HNStory:       story,
				URLDomain:     urlDomain,
				Item:          story.Data.Data,
				CommentsCount: commentsCount,
			}
			if story.Data.Data != nil && story.Data.Data.Text != nil {
				s.Text = *story.Data.Data.Text
			}
			for _, nc := range story.Content.NormalizedContent {
				for _, tc := range nc.TransformedContent {
					if tc.TransformerID == int32(genapi.TransformerID_SUMMARY) {
						s.Summary = tc.Data
					}
					if tc.TransformerID == int32(genapi.TransformerID_CATEGORIES) {
						err = json.Unmarshal([]byte(tc.Data), &s.Categories)
						if err != nil {
							log.Warn().Err(err).Msg("Failed to unmarshal categories")
						}
						if len(s.Categories) > 3 {
							s.Categories = s.Categories[:3]
						}
					}
				}
			}
			htmlStories = append(htmlStories, s)
		}

		p := html.HNParams{
			Stories: htmlStories,
		}
		err = a.htmlContent.WriteHN(w, p)
		if err != nil {
			serverError(w, err)
		}
	})

	r.Post("/save", func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseMultipartForm(10 << 20) // 10 MB
		if err != nil {
			serverError(w, err)
			return
		}

		text := r.FormValue("text")
		options := r.FormValue("options")
		shouldCrawl := r.FormValue("crawl-urls") == "on"
		_, fileData := getFileData(r)

		var o genapi.URLOptions
		if options != "" {
			err = json.Unmarshal([]byte(options), &o)
			if err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
		}

		var content []*genapi.Content
		if text != "" {
			var textIsLink bool

			// TODO breadchris this should be an extractor that can be configured to be run
			linkList := commonregex.Links(text)
			for _, link := range linkList {
				if text == link {
					textIsLink = true
				}
			}

			if textIsLink {
				for _, link := range linkList {
					content = append(content, &genapi.Content{
						Type: genapi.ContentType_URL,
						Data: []byte(link),
						Options: &genapi.Content_UrlOptions{
							UrlOptions: &genapi.URLOptions{
								Crawl: shouldCrawl,
							},
						},
					})
				}
			} else {
				content = append(content, &genapi.Content{
					Type: genapi.ContentType_TEXT,
					Data: []byte(text),
				})
			}
		}

		if fileData != nil {
			// TODO breadchris this assumes that the file uploaded is an audio file
			// really what should happen here is the mime type should be checked
			content = append(content, &genapi.Content{
				Type: genapi.ContentType_AUDIO,
				Data: fileData,
			})
		}

		contentIDs, err := a.apiServer.Save(context.Background(), connect_go.NewRequest(&genapi.Contents{
			Contents: content,
		}))
		if err != nil {
			serverError(w, err)
			return
		}

		var contentIDStrs []string
		for _, id := range contentIDs.Msg.ContentIDs {
			contentIDStrs = append(contentIDStrs, id.Id)
		}

		p := html.SaveParams{
			ContentIDs: contentIDStrs,
		}
		err = a.htmlContent.WriteSave(w, p)
		if err != nil {
			serverError(w, err)
		}
	})

	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		p := html.HomeParams{}
		err := a.htmlContent.WriteHome(w, p)
		if err != nil {
			serverError(w, err)
		}
	})

	r.Get("/save", func(w http.ResponseWriter, r *http.Request) {
		p := html.SaveParams{}
		err := a.htmlContent.WriteSave(w, p)
		if err != nil {
			serverError(w, err)
		}
	})

	r.Get("/view/{id}", func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")
		content, err := a.apiServer.Search(r.Context(), connect_go.NewRequest(&genapi.Query{
			ContentID: id,
		}))
		if err != nil {
			serverError(w, err)
			return
		}

		if len(content.Msg.StoredContent) == 0 {
			serverError(w, errors.Wrapf(err, "no content found for id %s", id))
			return
		}

		params := html.ViewParams{
			StoredContent: content.Msg.StoredContent[0],
		}
		err = a.htmlContent.WriteView(w, params)
		if err != nil {
			serverError(w, err)
		}
	})

	r.Get("/search", func(w http.ResponseWriter, r *http.Request) {
		content, err := a.apiServer.Search(r.Context(), connect_go.NewRequest(&genapi.Query{
			Query: "",
			Page:  0,
		}))
		if err != nil {
			serverError(w, err)
			return
		}

		p := html.SearchParams{
			Results: content.Msg,
		}

		err = a.htmlContent.WriteSearch(w, p)
		if err != nil {
			serverError(w, err)
			return
		}
	})

	fs := http.FS(html.Files)
	httpFileServer := http.FileServer(fs)

	r.Handle("/*", http.HandlerFunc(func(rw http.ResponseWriter, r *http.Request) {
		filePath := r.URL.Path
		if strings.Index(r.URL.Path, "/") == 0 {
			filePath = r.URL.Path[1:]
		}

		f, err := html.Files.Open(filePath)
		if os.IsNotExist(err) {
			r.URL.Path = "/"
		}

		if err == nil {
			f.Close()
		}
		httpFileServer.ServeHTTP(rw, r)
	}))
}
