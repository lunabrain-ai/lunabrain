package bucket

import (
	"gocloud.dev/blob"
	"io"
	"net/http"
)

func (b *Bucket) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	objKey, err := b.URLSigner.KeyFromURL(r.Context(), r.URL)
	if err != nil {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	allowedMethod := r.URL.Query().Get("method")
	if allowedMethod == "" {
		allowedMethod = http.MethodGet
	}
	if allowedMethod != r.Method {
		w.WriteHeader(http.StatusForbidden)
		return
	}
	contentType := r.URL.Query().Get("contentType")
	if r.Header.Get("Content-Type") != contentType {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	switch r.Method {
	case http.MethodGet:
		reader, err := b.NewReader(r.Context(), objKey, nil)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		defer reader.Close()
		io.Copy(w, reader)
	case http.MethodPut:
		writer, err := b.NewWriter(r.Context(), objKey, &blob.WriterOptions{
			ContentType: contentType,
		})
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		io.Copy(writer, r.Body)
		if err := writer.Close(); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	case http.MethodDelete:
		if err := b.Delete(r.Context(), objKey); err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}
	default:
		w.WriteHeader(http.StatusForbidden)
	}
}
