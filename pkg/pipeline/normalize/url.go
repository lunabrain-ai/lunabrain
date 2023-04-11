package normalize

import (
	"context"
	"fmt"
	"github.com/google/go-github/v51/github"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/lunabrain-ai/lunabrain/gen/python"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize/content"
	scrape2 "github.com/lunabrain-ai/lunabrain/pkg/scrape"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
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

	// If we were not able to normalize the url, scrape it
	if err == nil {
		c = append(c, &content.Content{
			NormalizerID: genapi.NormalizerID_URL_ARTICLE,
			Data:         c[0].Data,
		})
	} else {
		scrapedContents, err := s.scrapeURL(nurl)
		if err != nil {
			return nil, err
		}
		c = append(c, scrapedContents...)
	}
	return c, nil
}

func (s *URLNormalizer) scrapeURL(nurl string) ([]*content.Content, error) {
	var c []*content.Content
	resp, err := s.scraper.Scrape(nurl)
	if err != nil {
		log.Debug().Err(err).Str("url", nurl).Msg("unable to scrape url")

		return nil, errors.Errorf("unable to scrape url %s", nurl)
	}
	c = append(c, &content.Content{
		NormalizerID: genapi.NormalizerID_URL_HTML,
		Data:         resp.Content,
	})

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

	client := github.NewClient(nil)
	readmeContent, _, err := client.Repositories.GetReadme(context.Background(), user, repoName, nil)
	if err != nil {
		return nil, fmt.Errorf("error getting github readme: %v", err)
	}

	c, err := readmeContent.GetContent()
	if err != nil {
		return nil, fmt.Errorf("error getting github readme content: %v", err)
	}

	return []*content.Content{
		{
			NormalizerID: genapi.NormalizerID_GITHUB_README,
			Data:         c,
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
