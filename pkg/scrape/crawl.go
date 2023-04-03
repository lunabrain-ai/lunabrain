package scrape

import (
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"github.com/geziyor/geziyor"
	"github.com/geziyor/geziyor/client"
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
	fileStore *store.Files
}

func NewCrawler(fileStore *store.Files) *crawler {
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

func (c *crawler) linksParse(purl *url.URL) func(g *geziyor.Geziyor, r *client.Response) {
	dir := path.Join(c.fileStore.Location, "sites")

	return func(g *geziyor.Geziyor, r *client.Response) {
		// TODO breadchris use bucket to store this file
		err := util.SaveURLToFolder(dir, r.Request.URL, r.Body)
		if err != nil {
			err = errors.Wrapf(err, "error: save URL %s\n", r.Request.URL.String())
			log.Error().Err(err).Msg("")
			return
		}

		if r == nil || r.HTMLDoc == nil {
			return
		}

		selection := r.HTMLDoc.Find("a[href]")
		if selection == nil {
			return
		}

		selection.Each(func(i int, s *goquery.Selection) {
			val, _ := s.Attr("href")
			u, err := url.Parse(val)
			if err != nil {
				fmt.Printf("error: resolve URL %s - %s\n", val, err)
				return
			}

			if u.Scheme == "" {
				u.Scheme = purl.Scheme
			}

			if u.Host == "" {
				u.Host = purl.Host
			}

			if u.Host != purl.Host {
				return
			}

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
