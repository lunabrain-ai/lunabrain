package content

import (
	"context"
	connect_go "github.com/bufbuild/connect-go"
	"github.com/go-shiori/go-readability"
	"github.com/google/uuid"
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/gen/content"
	"github.com/lunabrain-ai/lunabrain/gen/content/contentconnect"
	"github.com/lunabrain-ai/lunabrain/pkg/bucket"
	"github.com/lunabrain-ai/lunabrain/pkg/content/normalize"
	"github.com/lunabrain-ai/lunabrain/pkg/content/store"
	"github.com/lunabrain-ai/lunabrain/pkg/ent"
	"github.com/lunabrain-ai/lunabrain/pkg/http"
	"github.com/lunabrain-ai/lunabrain/pkg/openai"
	"github.com/pkg/errors"
	"google.golang.org/protobuf/types/known/emptypb"
	"log"
	"regexp"
	"strings"
	"time"
)

type Service struct {
	content    *store.EntStore
	sess       *http.SessionManager
	openai     *openai.Agent
	normalizer *normalize.Normalize
	fileStore  *bucket.Bucket
}

var _ contentconnect.ContentServiceHandler = (*Service)(nil)

var ProviderSet = wire.NewSet(
	NewService,
	store.NewEntStore,
)

func NewService(
	db *store.EntStore,
	sess *http.SessionManager,
	openai *openai.Agent,
	normalizer *normalize.Normalize,
	fileStore *bucket.Bucket,
) *Service {
	return &Service{
		content:    db,
		sess:       sess,
		openai:     openai,
		normalizer: normalizer,
		fileStore:  fileStore,
	}
}

func (s *Service) Save(ctx context.Context, c *connect_go.Request[content.Contents]) (*connect_go.Response[content.ContentIDs], error) {
	uid, err := s.sess.GetUserID(ctx)
	if err != nil {
		return nil, err
	}

	if c.Msg.Content.Id == "" {
		c.Msg.Content.Id = uuid.New().String()
	}
	switch u := c.Msg.Content.Type.(type) {
	case *content.Content_Data:
		switch t := u.Data.Type.(type) {
		case *content.Data_File:
			if len(t.File.Data) > 0 {
				// TODO breadchris this syntax feels weird, i would expect to get back a path
				err := s.fileStore.Bucket.WriteAll(ctx, c.Msg.Content.Id, t.File.Data, nil)
				if err != nil {
					return nil, err
				}
				t.File.Url, err = s.fileStore.NewFile(c.Msg.Content.Id)
				if err != nil {
					return nil, err
				}
			}
			t.File.Data = nil
		}
	}

	norm, tags, err := s.normalizer.Normalize(ctx, uid, c.Msg.Content)
	if err != nil {
		return nil, errors.Wrapf(err, "unable to normalize content")
	}
	norm = append(norm, c.Msg.Related...)
	c.Msg.Content.Tags = append(c.Msg.Content.Tags, tags...)

	cnt, err := s.content.SaveContent(ctx, uid, uuid.Nil, c.Msg.Content, norm)
	if err != nil {
		return nil, errors.Wrapf(err, "unable to save content")
	}
	return connect_go.NewResponse(&content.ContentIDs{ContentIds: []string{cnt.String()}}), nil
}

func (s *Service) Search(ctx context.Context, c *connect_go.Request[content.Query]) (*connect_go.Response[content.Results], error) {
	userID, err := s.sess.GetUserID(ctx)
	if err != nil {
		return nil, err
	}

	// TODO breadchris content should not return internal model
	var ct []*ent.Content
	if c.Msg.ContentID != "" {
		parsedID, err := uuid.Parse(c.Msg.ContentID)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to parse content id")
		}
		singleContent, err := s.content.GetContentByID(ctx, parsedID)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to get stored content")
		}
		ct = append(ct, singleContent)
	} else {
		groupID := uuid.Nil
		if c.Msg.GroupID != "" {
			groupID, err = uuid.Parse(c.Msg.GroupID)
			if err != nil {
				return nil, errors.Wrapf(err, "unable to parse group id")
			}
		}
		// TODO breadchris pagination
		ct, err = s.content.SearchContent(ctx, userID, 0, 100, groupID, c.Msg.Tags)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to get stored content")
		}
	}

	var storedContent []*content.StoredContent
	for _, cn := range ct {
		var tags []*content.Tag
		for _, t := range cn.Edges.Tags {
			tags = append(tags, &content.Tag{Name: t.Name})
		}
		sc := &content.StoredContent{
			Id:      cn.ID.String(),
			Content: cn.Data.Content,
			Votes:   int32(len(cn.Edges.Votes)),
			Tags:    tags,
		}
		if cn.Edges.User != nil {
			sc.User = cn.Edges.User.Data.User
		}

		switch t := cn.Data.Type.(type) {
		case *content.Content_Data:
			switch u := t.Data.Type.(type) {
			case *content.Data_Url:
				sc.Url = u.Url.Url
			}
		}

		maxRelated := 20
		var related []*content.Content
		for _, r := range cn.Edges.Children {
			// TODO breadchris remove this limitation
			if len(related) >= maxRelated {
				break
			}

			rc := r.Data
			rc.Id = r.ID.String()

			related = append(related, rc.Content)
			switch t := r.Data.Type.(type) {
			case *content.Content_Normalized:
				switch u := t.Normalized.Type.(type) {
				case *content.Normalized_Readme:
					sc.Title = sc.Url
					sc.Description = u.Readme.Data
				case *content.Normalized_Article:
					sc.Title = u.Article.Title
					sc.Description = u.Article.Excerpt
					sc.Image = u.Article.Image
					sc.Preview = trimMarkdownWhitespace(u.Article.Text)
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
		id, err := uuid.Parse(ct)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to parse content id")
		}
		err = s.content.DeleteContent(ctx, id)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to save content")
		}
	}
	return connect_go.NewResponse(&content.ContentIDs{ContentIds: c.Msg.GetContentIds()}), nil
}

func (s *Service) SetTags(ctx context.Context, c *connect_go.Request[content.SetTagsRequest]) (*connect_go.Response[emptypb.Empty], error) {
	_, err := s.sess.GetUserID(ctx)
	if err != nil {
		return nil, err
	}

	id, err := uuid.Parse(c.Msg.ContentId)
	if err != nil {
		return nil, errors.Wrapf(err, "unable to parse content id")
	}
	err = s.content.SetTags(ctx, id, c.Msg.Tags)
	if err != nil {
		return nil, errors.Wrapf(err, "unable to set tags")
	}
	return connect_go.NewResponse(&emptypb.Empty{}), nil
}

func (s *Service) GetTags(ctx context.Context, c *connect_go.Request[content.TagRequest]) (*connect_go.Response[content.Tags], error) {
	var (
		err error
		ts  []string
	)
	if c.Msg.GroupId != "" {
		gID, err := uuid.Parse(c.Msg.GroupId)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to parse group id")
		}
		ts, err = s.content.GetTagsForGroup(ctx, gID)
	} else {
		ts, err = s.content.GetTags(ctx)
	}
	if err != nil {
		return nil, errors.Wrapf(err, "unable to get tags")
	}

	root := &content.Tag{Name: "root"}
	for _, t := range ts {
		processTags(root, t)
	}
	return connect_go.NewResponse(&content.Tags{Tags: root.SubTags}), nil
}

func (s *Service) Vote(ctx context.Context, c *connect_go.Request[content.VoteRequest]) (*connect_go.Response[content.VoteResponse], error) {
	id, err := s.sess.GetUserID(ctx)
	if err != nil {
		return nil, err
	}

	cuid, err := uuid.Parse(c.Msg.ContentId)
	if err != nil {
		return nil, errors.Wrapf(err, "unable to parse content id")
	}
	err = s.content.VoteOnContent(ctx, id, cuid)
	if err != nil {
		return nil, errors.Wrapf(err, "unable to vote on content")
	}
	votes, err := s.content.GetContentVotes(ctx, cuid)
	if err != nil {
		return nil, errors.Wrapf(err, "unable to get content votes")
	}
	return connect_go.NewResponse(&content.VoteResponse{
		Votes: uint32(len(votes)),
	}), nil
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

func trimMarkdownWhitespace(md string) string {
	// Remove leading and trailing whitespace
	md = strings.TrimSpace(md)

	// Replace multiple consecutive newlines with a single newline
	md = regexp.MustCompile(`\n{3,}`).ReplaceAllString(md, "\n\n")

	// Replace multiple spaces with a single space outside of code snippets
	codeBlocks := regexp.MustCompile("`[^`]+`")
	matches := codeBlocks.FindAllString(md, -1)
	for _, match := range matches {
		md = strings.Replace(md, match, strings.ReplaceAll(match, " ", "␣"), -1)
	}

	md = regexp.MustCompile(` +`).ReplaceAllString(md, " ")

	for _, match := range matches {
		md = strings.Replace(md, match, strings.ReplaceAll(match, "␣", " "), -1)
	}

	return md
}
