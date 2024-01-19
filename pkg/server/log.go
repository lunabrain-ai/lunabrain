package server

import (
	"context"
	"fmt"
	"github.com/bufbuild/connect-go"
	"log/slog"
	"net/http"
)

func NewLogInterceptor() connect.UnaryInterceptorFunc {
	// TODO breadchris support logging for stream calls
	return func(next connect.UnaryFunc) connect.UnaryFunc {
		return func(
			ctx context.Context,
			req connect.AnyRequest,
		) (connect.AnyResponse, error) {
			resp, err := next(ctx, req)
			if err != nil {
				slog.Error("connect error", "error", fmt.Sprintf("%+v", err))
				// TODO breadchris this should only be done for local dev
				fmt.Printf("%+v\n", err)
			}
			return resp, err
		}
	}
}

func loggingMiddleware(next http.Handler) http.Handler {
	//limiter := NewRateLimiter()
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//peerIP := r.Header.Get("x-forwarded-for")
		//if peerIP != "" {
		//	if !limiter.Visit(peerIP) {
		//		//slog.Warn("rate limit exceeded", "peerIP", peerIP)
		//		http.Error(w, http.StatusText(http.StatusTooManyRequests), http.StatusTooManyRequests)
		//		return
		//	}
		//}

		slog.Debug("request", "method", r.Method, "path", r.URL.Path, "params", r.URL.Query())
		next.ServeHTTP(w, r)
	})
}
