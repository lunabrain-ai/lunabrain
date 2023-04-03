package client

import (
	"context"
	"encoding/json"
	"github.com/go-chi/chi"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/lunabrain-ai/lunabrain/pkg/client/html"
	"github.com/mingrammer/commonregex"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	"io"
	"net/http"
	"os"
	"strings"
)

func getFileData(r *http.Request) (string, []byte) {
	formFile, header, err := r.FormFile("file")
	if err != nil {
		log.Warn().Msg("Failed to get audio file")
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
	r.Post("/save", func(w http.ResponseWriter, r *http.Request) {
		err := r.ParseMultipartForm(10 << 20) // 10 MB
		if err != nil {
			serverError(w, err)
			return
		}

		text := r.FormValue("text")
		options := r.FormValue("options")
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
			content = append(content, &genapi.Content{
				Type: genapi.ContentType_AUDIO,
				Data: fileData,
			})
		}

		contentIDs, err := a.apiServer.Save(context.Background(), &genapi.Contents{Contents: content})
		if err != nil {
			serverError(w, err)
			return
		}

		var contentIDStrs []string
		for _, id := range contentIDs.ContentIDs {
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
		content, err := a.apiServer.Search(r.Context(), &genapi.Query{
			ContentID: id,
		})
		if err != nil {
			serverError(w, err)
			return
		}

		if len(content.StoredContent) == 0 {
			serverError(w, errors.Wrapf(err, "no content found for id %s", id))
			return
		}

		params := html.ViewParams{
			StoredContent: content.StoredContent[0],
		}
		err = a.htmlContent.WriteView(w, params)
		if err != nil {
			serverError(w, err)
		}
	})

	r.Get("/search", func(w http.ResponseWriter, r *http.Request) {
		content, err := a.apiServer.Search(r.Context(), &genapi.Query{
			Query: "",
			Page:  0,
		})
		if err != nil {
			serverError(w, err)
			return
		}

		p := html.SearchParams{
			Results: content,
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
