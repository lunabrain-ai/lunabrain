package scrape

import (
	"github.com/PuerkitoBio/goquery"
	"github.com/geziyor/geziyor"
	"github.com/geziyor/geziyor/client"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize/content"
	"github.com/lunabrain-ai/lunabrain/pkg/store"
	"github.com/lunabrain-ai/lunabrain/pkg/util"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	"net/url"
	"path"
	"sync"
)

var (
	dup  = map[string]bool{}
	lock = sync.Mutex{}
)

type Crawler interface {
	Crawl(url string) error
}

type crawler struct {
	fileStore *store.Bucket
}

func NewCrawler(fileStore *store.Bucket) *crawler {
	return &crawler{
		fileStore: fileStore,
	}
}

func (c *crawler) Crawl(nurl string) error {
	purl, err := url.Parse(nurl)
	if err != nil {
		return errors.Wrapf(err, "error: parse URL %s\n", nurl)
	}
	g := geziyor.NewGeziyor(&geziyor.Options{
		StartURLs:          []string{nurl},
		ParseFunc:          c.linksParse(purl),
		ConcurrentRequests: 10,
	})
	g.Start()
	return nil
}

// resolveRelativeURL just correctly join a base domain to a relative path
// to produce an absolute path to fetch on.
// It returns a tuple, a string representing the absolute path with resolved
// paths and a boolean representing the success or failure of the process.
func resolveRelativeURL(baseURL string, relative string) (*url.URL, bool) {
	u, err := url.Parse(relative)
	if err != nil {
		return nil, false
	}
	if u.Hostname() != "" {
		return u, true
	}
	base, err := url.Parse(baseURL)
	if err != nil {
		return nil, false
	}
	return base.ResolveReference(u), true
}

func (c *crawler) linksParse(purl *url.URL) func(g *geziyor.Geziyor, r *client.Response) {
	rawDir := path.Join(c.fileStore.Location, "sites", "raw")
	normalDir := path.Join(c.fileStore.Location, "sites", "normal")

	return func(g *geziyor.Geziyor, r *client.Response) {
		// Check if this is an html page, if not return
		if !r.IsHTML() {
			return
		}

		// TODO breadchris use bucket to store this file
		err := util.SaveURLToFolder(rawDir, r.Request.URL, r.Body)
		if err != nil {
			err = errors.Wrapf(err, "error: save raw content for %s\n", r.Request.URL.String())
			log.Error().Err(err).Msg("")
			return
		}

		article, err := content.FormatHTMLAsArticle(string(r.Body), r.Request.URL.String())
		if err == nil {
			// TODO breadchris use bucket to store this file
			err = util.SaveURLToFolder(normalDir, r.Request.URL, []byte(article))
			if err != nil {
				err = errors.Wrapf(err, "error: save article for %s\n", r.Request.URL.String())
				log.Error().Err(err).Msg("")
				return
			}
		}

		if r == nil || r.HTMLDoc == nil {
			return
		}

		selection := r.HTMLDoc.Find("a[href]")
		if selection == nil {
			return
		}

		requestURL := r.Request.URL

		selection.Each(func(i int, s *goquery.Selection) {
			val, _ := s.Attr("href")
			u, err := url.Parse(val)
			if err != nil {
				log.Error().Err(err).Msg("unable to parse url")
				return
			}

			if u.Host != "" && u.Host != purl.Host {
				return
			}

			u = requestURL.ResolveReference(u)
			u.Fragment = ""

			queue := false
			lock.Lock()
			if !dup[u.String()] {
				dup[u.String()] = true
				queue = true
			}
			lock.Unlock()

			if queue {
				// TODO breadchris merge crawling queue code https://github.com/geziyor/geziyor/pull/59/files
				g.Get(u.String(), c.linksParse(purl))
			}
		})
	}
}
