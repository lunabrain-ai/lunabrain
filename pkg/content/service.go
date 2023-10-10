package content

import (
	"context"
	connect_go "github.com/bufbuild/connect-go"
	"github.com/go-shiori/go-readability"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/gen/content"
	"github.com/lunabrain-ai/lunabrain/gen/content/contentconnect"
	"github.com/lunabrain-ai/lunabrain/pkg/db"
	"github.com/lunabrain-ai/lunabrain/pkg/db/model"
	"github.com/lunabrain-ai/lunabrain/pkg/openai"
	"github.com/pkg/errors"
	"log"
	"time"
)

type Service struct {
	db     *db.Store
	openai *openai.Agent
}

var _ contentconnect.ContentServiceHandler = (*Service)(nil)

func (s *Service) Save(ctx context.Context, c *connect_go.Request[content.Contents]) (*connect_go.Response[content.ContentIDs], error) {
	norm, err := Normalize(c.Msg.Content)
	if err != nil {
		return nil, errors.Wrapf(err, "unable to normalize content")
	}
	norm = append(norm, c.Msg.Related...)

	cnt, err := s.db.SaveContent(c.Msg.Content, norm)
	if err != nil {
		return nil, errors.Wrapf(err, "unable to save content")
	}
	return connect_go.NewResponse(&content.ContentIDs{ContentIds: []string{cnt.String()}}), nil
}

func (s *Service) Search(ctx context.Context, c *connect_go.Request[content.Query]) (*connect_go.Response[content.Results], error) {
	var (
		err error
		ct  []model.Content
	)
	if c.Msg.ContentID != "" {
		parsedID, err := uuid.Parse(c.Msg.ContentID)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to parse content id")
		}
		singleContent, err := s.db.GetContentByID(parsedID)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to get stored content")
		}
		ct = append(ct, *singleContent)
	} else {
		ct, _, err = s.db.GetAllContent(0, 100)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to get stored content")
		}
	}

	var storedContent []*content.StoredContent
	for _, cn := range ct {
		sc := &content.StoredContent{
			Id:      cn.ID.String(),
			Content: cn.Data,
		}

		var related []*content.Content
		for _, r := range cn.RelatedContent {
			related = append(related, r.ContentData.Data)
			switch t := r.ContentData.Data.Type.(type) {
			case *content.Content_Normalized:
				switch u := t.Normalized.Type.(type) {
				case *content.Normalized_Article:
					sc.Title = u.Article.Title
					sc.Description = u.Article.Excerpt
					sc.Image = u.Article.Image
				}
			}
		}
		sc.Related = related
		storedContent = append(storedContent, sc)
	}
	return connect_go.NewResponse(&content.Results{StoredContent: storedContent}), nil
}

func (s *Service) Delete(ctx context.Context, c *connect_go.Request[content.ContentIDs]) (*connect_go.Response[content.ContentIDs], error) {
	for _, ct := range c.Msg.ContentIds {
		err := s.db.DeleteContent(ct)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to save content")
		}
	}
	return connect_go.NewResponse(&content.ContentIDs{ContentIds: c.Msg.GetContentIds()}), nil
}

func (s *Service) Analyze(ctx context.Context, c *connect_go.Request[content.Content]) (*connect_go.Response[content.Contents], error) {
	var nCnt []*content.Content
	switch t := c.Msg.Type.(type) {
	case *content.Content_Data:
		switch u := t.Data.Type.(type) {
		case *content.Data_Url:
			article, err := readability.FromURL(u.Url.Url, 30*time.Second)
			if err != nil {
				log.Fatalf("failed to parse %s, %v\n", u.Url.Url, err)
			}

			basePrompt := "This is an article about " + article.Title + `.
You are a hierarchical classifier for a software engineer.
You accept content and then only return a categorical path where that content would exist.
The path should be in the form: category/subcategory/other-category. 
For example, an article about how AI is affecting computers would have the category: technology/ai/computers
Here is the content: \n\n`

			cat, err := s.openai.Prompt(ctx, basePrompt+article.TextContent)
			if err != nil {
				return nil, errors.Wrapf(err, "unable to analyze content: %s", u.Url.Url)
			}

			nCnt = append(nCnt, &content.Content{
				Tags: []string{cat},
				Type: &content.Content_Normalized{
					Normalized: &content.Normalized{
						Type: &content.Normalized_Article{
							Article: &content.Article{
								Title:    article.Title,
								Author:   article.Byline,
								Length:   int32(article.Length),
								Excerpt:  article.Excerpt,
								SiteName: article.SiteName,
								Image:    article.Image,
								Favicon:  article.Favicon,
								Text:     article.TextContent,
							},
						},
					},
				},
			})
		}
	}
	return connect_go.NewResponse(&content.Contents{
		Content: c.Msg,
		Related: nCnt,
	}), nil
}

func NewService(
	db *db.Store,
	openai *openai.Agent,
) *Service {
	return &Service{
		db:     db,
		openai: openai,
	}
}
