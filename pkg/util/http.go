package util

import (
	"github.com/rs/zerolog/log"
	"net/http"
	"net/http/httputil"
)

func DumpRequest(r *http.Request) {
	dumpedRequest, err := httputil.DumpRequest(r, true)
	if err != nil {
		log.Error().Err(err).Msg("unable to dump http request")
		return
	}
	println(string(dumpedRequest))
}
