package content

import (
	md "github.com/JohannesKaufmann/html-to-markdown"
	"github.com/PuerkitoBio/goquery"
	goose "github.com/advancedlogic/GoOse"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
	"strings"
)

func FormatHTMLAsArticle(html, nurl string) (string, error) {
	defer func() {
		if r := recover(); r != nil {
			log.Warn().Msgf("panic while parsing html: %v", r)
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
