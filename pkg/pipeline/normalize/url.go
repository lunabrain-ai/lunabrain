package normalize

import (
	"context"
	"fmt"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/lunabrain-ai/lunabrain/gen/python"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize/content"
	scrape2 "github.com/lunabrain-ai/lunabrain/pkg/scrape"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	"io"
	"net/http"
	"net/url"
	"strings"
)

type URLNormalizer struct {
	config  URLConfig
	client  python.PythonClient
	scraper scrape2.Scraper
	crawler scrape2.Crawler
}

func determineURLType(purl *url.URL) (string, error) {
	if strings.Contains(purl.Host, "youtube.com") && purl.Path == "/watch" {
		return "youtube", nil
	}

	if strings.Contains(purl.Host, "github.com") {
		return "github", nil
	}

	return "", errors.Errorf("unable to determine url type for url %s", purl)
}

func (s *URLNormalizer) Normalize(nurl string, crawl bool) ([]*content.Content, error) {
	// TODO breadchris determine what to do about the "collect" vs "normalize" phases
	if crawl {
		err := s.crawler.Crawl(nurl)
		return []*content.Content{}, err
	}

	// Parse the url
	purl, err := url.Parse(nurl)
	if err != nil {
		return nil, errors.Wrapf(err, "unable to parse url %s", nurl)
	}

	var c []*content.Content

	urlType, err := determineURLType(purl)
	if err == nil && s.config.DomainContent {
		switch urlType {
		case "youtube":
			log.Info().Str("url", nurl).Msg("normalizing youtube url")
			c, err = s.normalizeYoutube(purl)
		case "github":
			log.Info().Str("url", nurl).Msg("normalizing github url")
			c, err = s.normalizeGithub(purl)
		}
	}

	// If we were able to normalize the url, return the content
	if err == nil {
		return c, nil
	}

	resp, err := s.scraper.Scrape(nurl)
	if err != nil {
		log.Debug().Err(err).Str("url", nurl).Msg("unable to scrape url")

		return nil, errors.Errorf("unable to scrape url %s", nurl)
	} else {
		c = append(c, &content.Content{
			NormalizerID: genapi.NormalizerID_URL_HTML,
			Data:         resp.Content,
		})
	}

	clean, err := content.CleanRawHTML(resp.Content)
	if err != nil {
		log.Debug().Err(err).Str("url", nurl).Msg("unable to clean raw html")
	} else {
		c = append(c, &content.Content{
			NormalizerID: genapi.NormalizerID_URL_CLEAN,
			Data:         clean,
		})
	}

	article, err := content.FormatHTMLAsArticle(resp.Content, nurl)
	if err != nil {
		log.Debug().Err(err).Str("url", nurl).Msg("unable to format content as article")
	} else {
		c = append(c, &content.Content{
			NormalizerID: genapi.NormalizerID_URL_ARTICLE,
			Data:         article,
		})
	}
	return c, nil
}

func (s *URLNormalizer) normalizeYoutube(url *url.URL) ([]*content.Content, error) {
	id := content.ExtractVideoID(url)
	resp, err := s.client.YoutubeTranscript(context.Background(), &python.Video{Id: id})
	if err != nil {
		return nil, errors.Wrapf(err, "unable to get youtube transcript for url %s", url)
	}

	var transcript string
	for _, t := range resp.Transcript {
		transcript += t.Text + " "
	}

	return []*content.Content{
		{
			NormalizerID: genapi.NormalizerID_URL_YOUTUBE_TRANSCRIPT,
			Data:         transcript,
		},
	}, nil
}

func (s *URLNormalizer) normalizeGithub(url *url.URL) ([]*content.Content, error) {
	user, repoName := content.ParseGitHubURL(url.String())
	if user == "" || repoName == "" {
		return nil, errors.Errorf("unable to parse github url %s", url)
	}

	readmeURL := fmt.Sprintf("https://raw.githubusercontent.com/%s/%s/main/README.md", user, repoName)
	log.Debug().
		Str("url", readmeURL).
		Msg("fetching github readme")

	response, err := http.Get(readmeURL)
	if err != nil {
		return nil, fmt.Errorf("error making HTTP request: %v", err)
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %v", response.StatusCode)
	}

	// Read the contents of the response body into a byte slice
	body, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading response body: %v", err)
	}

	return []*content.Content{
		{
			NormalizerID: genapi.NormalizerID_GITHUB_README,
			Data:         string(body),
		},
	}, nil
}

func NewURLNormalizer(
	config Config,
	client python.PythonClient,
	scraper scrape2.Scraper,
	crawler scrape2.Crawler,
) (*URLNormalizer, error) {
	return &URLNormalizer{
		config:  config.URL,
		client:  client,
		scraper: scraper,
		crawler: crawler,
	}, nil
}
