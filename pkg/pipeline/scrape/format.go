package scrape

import (
	"errors"
	"strings"

	md "github.com/JohannesKaufmann/html-to-markdown"
	"github.com/PuerkitoBio/goquery"
	goose "github.com/advancedlogic/GoOse"
	"github.com/rs/zerolog/log"
)

func NormalizeContent(content string) (string, error) {
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

	log.Debug().
		Err(err).
		Msg("failed to parse with goquery, reporting error")
	return "", err
}

func formatContentAsMarkdown(input, nurl string) (content string, err error) {
	defer func() {
		if recover() != nil {
			log.Error().
				Str("nurl", nurl).
				Err(err).
				Msg("unable to format Content")
			err = errors.New("unable to format Content")
		}
	}()

	g := goose.New()

	// could panic
	gArticle, err := g.ExtractFromRawHTML(input, nurl)
	if err != nil {
		log.Error().
			Err(err).
			Msg("unable to parse html from input")
		return
	}

	converter := md.NewConverter("", true, nil)
	content = "# " + gArticle.Title + "\n\n" + converter.Convert(gArticle.TopNode)
	return
}
