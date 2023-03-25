package normalize

import (
	"context"
	"github.com/lunabrain-ai/lunabrain/gen/python"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize/content"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/scrape"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	nurl "net/url"
)

type URLNormalizer struct {
	client  python.PythonClient
	scraper scrape.Scraper
	db      db.Store
}

func determineURLType(url string) (string, error) {
	parsedURL, err := nurl.Parse(url)
	if err != nil {
		return "", errors.Wrapf(err, "unable to parse url %s", url)
	}

	if parsedURL.Host == "www.youtube.com" && parsedURL.Path == "/watch" {
		return "youtube", nil
	}

	return "", errors.Errorf("unable to determine url type for url %s", url)
}

func (s *URLNormalizer) Normalize(url string) (string, string, error) {
	urlType, err := determineURLType(url)
	if err == nil {
		switch urlType {
		case "youtube":
			log.Info().Str("url", url).Msg("normalizing youtube url")
			return s.normalizeYoutube(url)
		}
	}

	resp, err := s.scraper.ScrapeWithChrome(url)
	if err != nil {
		return "", "", errors.Wrapf(err, "unable to scrape url")
	}

	normalized, err := scrape.NormalizeContent(resp.Content)
	if err != nil {
		return "", "", errors.Wrapf(err, "unable to normalize content for url %s", url)
	}
	return normalized, resp.Content, nil
}

func (s *URLNormalizer) normalizeYoutube(url string) (string, string, error) {
	id := content.ExtractVideoID(url)
	resp, err := s.client.YoutubeTranscript(context.Background(), &python.Video{Id: id})
	if err != nil {
		return "", "", errors.Wrapf(err, "unable to get youtube transcript for url %s", url)
	}

	var transcript string
	for _, t := range resp.Transcript {
		transcript += t.Text + " "
	}
	return transcript, "", nil
}

func NewURLNormalizer(client python.PythonClient, scraper scrape.Scraper, db db.Store) (*URLNormalizer, error) {
	return &URLNormalizer{
		client:  client,
		scraper: scraper,
	}, nil
}
