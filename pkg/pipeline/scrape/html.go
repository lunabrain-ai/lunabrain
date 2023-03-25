package scrape

import (
	"context"
	"github.com/pkg/errors"
	"io"
	"net/http"
	"time"

	"github.com/chromedp/cdproto/cdp"
	"github.com/chromedp/cdproto/fetch"
	"github.com/chromedp/cdproto/network"
	"github.com/chromedp/chromedp"
	"github.com/rs/zerolog/log"
)

type Response struct {
	Title       string
	Content     string
	ContentType string
}

func (p *scraper) scrapeContent(url string) (*Response, error) {
	// if there are no browser domains set or the url contains one of the browser domains, scrape with chrome
	shouldScrapeWithBrowser := len(p.browserDomains) == 0
	if shouldScrapeWithBrowser {
		//resp, err := p.ScrapeURLWithChrome(url)
		//if err != nil {
		//	log.Warn().
		//		Err(err).
		//		Str("url", url).
		//		Msg("Failed to scrape Host with Chrome")
		//	return p.scrapeContentWithHTTPClient(url)
		//}
		return &Response{}, nil
	}
	return p.scrapeContentWithHTTPClient(url)
}

func (p *scraper) scrapeContentWithHTTPClient(url string) (*Response, error) {
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		log.Error().
			Err(err).
			Str("url", url).
			Msg("Failed to create request for reference Host")
		return nil, err
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36")

	resp, err := p.httpClient.Do(req)
	if err != nil {
		log.Error().
			Err(err).
			Str("url", url).
			Msg("Failed to fetch reference Host")
		return nil, err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	// TODO parse header out of respBody
	return &Response{
		Title:       "",
		Content:     string(respBody),
		ContentType: resp.Header.Get("Content-Type"),
	}, nil
}

func listenForNetworkEvent(ctx context.Context) {
	chromedp.ListenTarget(ctx, func(ev interface{}) {
		switch ev := ev.(type) {

		case *network.EventResponseReceived:
			resp := ev.Response
			if len(resp.Headers) != 0 {
				log.Printf("received headers: %s", resp.Headers)
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
					log.Print(err)
				}

			case *fetch.EventRequestPaused:
				c := chromedp.FromContext(ctx)
				execCtx := cdp.WithExecutor(ctx, c.Target)
				err := fetch.ContinueRequest(ev.RequestID).Do(execCtx)
				if err != nil {
					log.Print(err)
				}
			}
		}()
	})
}

func (p *scraper) ScrapeWithChrome(url string) (*Response, error) {
	o := chromedp.DefaultExecAllocatorOptions[:]
	if p.config.Proxy.Host != "" {
		o = append(o,
			chromedp.ProxyServer(p.config.Proxy.Host),
		)
	}

	o = append(o,
		chromedp.Flag("headless", true),
		chromedp.Flag("disable-gpu", true),
		chromedp.Flag("no-sandbox", true),
	)

	cx, cancel := chromedp.NewExecAllocator(
		context.Background(), o...)
	defer cancel()

	ctx, cancel := chromedp.NewContext(
		cx,
		chromedp.WithDebugf(log.Printf),
	)
	defer cancel()

	//whenPromptedLoginToProxy(ctx, p.config.Proxy.Username, p.config.Proxy.Password)

	timeoutCtx, timeoutCancel := context.WithTimeout(ctx, 10*time.Second)
	defer timeoutCancel()

	start := time.Now()

	var (
		html  string
		title string
	)
	err := chromedp.Run(timeoutCtx,
		//fetch.Enable().WithHandleAuthRequests(true),
		//navigateWithError(url),
		chromedp.Navigate(url),
		chromedp.Sleep(1*time.Second),
		chromedp.OuterHTML("html", &html),
		chromedp.Title(&title),
	)
	if err != nil {
		return nil, errors.Wrapf(err, "failed to scrape Host with Chrome: %s", url)
	}

	log.Debug().
		Float64("duration", time.Since(start).Seconds()).
		Msg("Scraped Host with Chrome")
	return &Response{
		Title:       title,
		Content:     html,
		ContentType: "text/html",
	}, nil
}
