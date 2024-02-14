package server

import (
	"context"
	"fmt"
	"github.com/bufbuild/connect-go"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/event"
	"log/slog"
	"net/http"
	"strings"
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

func (a *APIHTTPServer) loggingMiddleware(next http.Handler) http.Handler {
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

		headers := map[string]string{}
		for k, v := range r.Header {
			headers[k] = strings.Join(v, ", ")
		}

		_, err := a.eventService.Send(r.Context(), connect.NewRequest(&event.Metric{
			Type: &event.Metric_Http{
				Http: &event.HTTPRequest{
					Method:     r.Method,
					Path:       r.URL.Path,
					Query:      r.URL.Query().Encode(),
					Headers:    headers,
					Host:       r.Host,
					RemoteAddr: r.RemoteAddr,
					UserAgent:  r.UserAgent(),
					Referer:    r.Referer(),
				},
			},
		}))
		if err != nil {
			slog.Warn("failed to send event", "error", err)
		}

		// record unique visitors
		_, err = r.Cookie("visitor_id")
		if err != nil {
			cookie := &http.Cookie{
				Name:     "visitor_id",
				Value:    uuid.NewString(),
				Path:     "/",
				HttpOnly: true,
			}
			http.SetCookie(w, cookie)
		}

		slog.Debug("request", "method", r.Method, "path", r.URL.Path, "params", r.URL.Query())
		next.ServeHTTP(w, r)
	})
}
