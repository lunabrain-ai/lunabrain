package util

import (
	"log/slog"
	"net/http"
	"net/http/httputil"
)

func DumpRequest(r *http.Request) {
	dumpedRequest, err := httputil.DumpRequest(r, true)
	if err != nil {
		slog.Error("unable to dump http request", "err", err)
		return
	}
	println(string(dumpedRequest))
}
