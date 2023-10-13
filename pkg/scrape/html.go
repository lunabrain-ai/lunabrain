package scrape

import (
	"context"
	"fmt"
	md "github.com/JohannesKaufmann/html-to-markdown"
	"github.com/PuerkitoBio/goquery"
	goose "github.com/advancedlogic/GoOse"
	"github.com/chromedp/cdproto/cdp"
	"github.com/chromedp/cdproto/fetch"
	"github.com/chromedp/cdproto/network"
	"github.com/chromedp/chromedp"
	"github.com/pkg/errors"
	"log/slog"
	"strings"
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

// TODO breadchris was there a reason to use goose over https://github.com/go-shiori/go-readability/blob/c66949dfc0add50a60684bcf6cd1911a4a9cf483/readability.go#L24
func FormatHTMLAsArticle(html, nurl string) (string, error) {
	defer func() {
		if r := recover(); r != nil {
			slog.Warn("panic while parsing html", "panic", fmt.Sprintf("%+v", r))
		}
	}()

	g := goose.New()

	// could panic
	gArticle, err := g.ExtractFromRawHTML(html, nurl)
	if err != nil {
		err = errors.Wrapf(err, "unable to parse html body")
		return "", err
	}

	converter := md.NewConverter("", true, nil)
	content := "# " + gArticle.Title + "\n\n" + converter.Convert(gArticle.TopNode)
	return content, nil
}

func CleanRawHTML(content string) (string, error) {
	contentReader := strings.NewReader(content)
	doc, err := goquery.NewDocumentFromReader(contentReader)
	if err == nil {
		// Remove tags that provide no value
		doc.Find("script,style,iframe,nav,head").Each(func(i int, s *goquery.Selection) {
			s.Remove()
		})

		// Select text from body
		normalText := ""
		doc.Find("body").Each(func(i int, s *goquery.Selection) {
			// For each item found, get the Title
			normalText += strings.Join(strings.Fields(s.Text()), " ") + " "
		})
		return normalText, nil
	}
	return "", errors.Wrapf(err, "unable to parse html body")
}
