package scrape

import (
	"context"
	"github.com/chromedp/cdproto/cdp"
	"github.com/chromedp/cdproto/fetch"
	"github.com/chromedp/cdproto/network"
	"github.com/chromedp/chromedp"
	"log/slog"
)

type Response struct {
	Title       string
	Content     string
	ContentType string
}

func listenForNetworkEvent(ctx context.Context) {
	chromedp.ListenTarget(ctx, func(ev interface{}) {
		switch ev := ev.(type) {

		case *network.EventResponseReceived:
			resp := ev.Response
			if len(resp.Headers) != 0 {
				slog.Debug("received headers", "headers", resp.Headers)
			}
		}
	})
}
func navigateWithError(url string) chromedp.ActionFunc {
	return func(ctx context.Context) error {
		resp, err := chromedp.RunResponse(ctx, chromedp.Navigate(url))
		if err != nil {
			return err
		}
		if resp.Status != 200 {
			return err
		}
		return nil
	}
}

func whenPromptedLoginToProxy(ctx context.Context, username, password string) {
	chromedp.ListenTarget(ctx, func(ev interface{}) {
		go func() {
			switch ev := ev.(type) {
			case *fetch.EventAuthRequired:
				c := chromedp.FromContext(ctx)
				execCtx := cdp.WithExecutor(ctx, c.Target)

				resp := &fetch.AuthChallengeResponse{
					Response: fetch.AuthChallengeResponseResponseProvideCredentials,
					Username: username,
					Password: password,
				}

				err := fetch.ContinueWithAuth(ev.RequestID, resp).Do(execCtx)
				if err != nil {
					slog.Debug("failed to continue with auth", "err", err)
				}

			case *fetch.EventRequestPaused:
				c := chromedp.FromContext(ctx)
				execCtx := cdp.WithExecutor(ctx, c.Target)
				err := fetch.ContinueRequest(ev.RequestID).Do(execCtx)
				if err != nil {
					slog.Error("failed to continue request", "err", err)
				}
			}
		}()
	})
}
