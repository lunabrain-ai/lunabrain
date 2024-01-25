package content

import (
	"context"
	"fmt"
	connect_go "github.com/bufbuild/connect-go"
	"github.com/go-shiori/go-readability"
	"github.com/google/uuid"
	"github.com/google/wire"
	"github.com/lunabrain-ai/lunabrain/pkg/bucket"
	"github.com/lunabrain-ai/lunabrain/pkg/content/normalize"
	"github.com/lunabrain-ai/lunabrain/pkg/content/store"
	"github.com/lunabrain-ai/lunabrain/pkg/ent"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/content"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/content/contentconnect"
	"github.com/lunabrain-ai/lunabrain/pkg/http"
	"github.com/lunabrain-ai/lunabrain/pkg/openai"
	"github.com/lunabrain-ai/lunabrain/pkg/publish"
	"github.com/lunabrain-ai/lunabrain/pkg/util"
	"github.com/lunabrain-ai/lunabrain/pkg/whisper"
	"github.com/pkg/errors"
	"github.com/protoflow-labs/protoflow/pkg/grpc"
	"google.golang.org/protobuf/reflect/protoreflect"
	"google.golang.org/protobuf/types/known/emptypb"
	"log"
	"log/slog"
	"net/url"
	"os"
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
	builder    *bucket.Builder
	whisper    *whisper.Client
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
	builder *bucket.Builder,
	whisper *whisper.Client,
) *Service {
	return &Service{
		content:    db,
		sess:       sess,
		openai:     openai,
		normalizer: normalizer,
		fileStore:  fileStore,
		builder:    builder,
		whisper:    whisper,
	}
}

func (s *Service) VoiceInput(ctx context.Context, c *connect_go.Request[content.VoiceInputRequest], c2 *connect_go.ServerStream[content.VoiceInputResponse]) error {
	obs := s.whisper.Transcribe(ctx, "", "", 0)
	<-obs.ForEach(func(v any) {
		if t, ok := v.(*content.Segment); ok {
			slog.Debug("sending voice input", "t", t)
			// combine the segment
			if err := c2.Send(&content.VoiceInputResponse{
				Segment: t,
			}); err != nil {
				slog.Error("error sending voice input", err)
			}
		}
	}, func(err error) {
		slog.Error("error transcribing", err)
	}, func() {
		slog.Info("done transcribing")
	})
	return nil
}

func (s *Service) sourceToContent(ctx context.Context, cs *content.Source, r *content.GetSourcesRequest) ([]*content.Content, error) {
	switch t := cs.Type.(type) {
	case *content.Source_Server:
		resp, err := s.Search(ctx, connect_go.NewRequest(&content.Query{
			ContentTypes: r.ContentTypes,
		}))
		if err != nil {
			return nil, err
		}
		var cnt []*content.Content
		for _, sc := range resp.Msg.StoredContent {
			cnt = append(cnt, sc.Content)
		}
		return cnt, nil
	case *content.Source_Folder:
		obs := util.WalkDirectory(t.Folder.Path, ".md")
		var (
			errs []error
			cnt  []*content.Content
		)
		<-obs.ForEach(func(v any) {
			if p, ok := v.(string); ok {
				mc, err := parseMarkdown(p)
				if err != nil {
					errs = append(errs, err)
					return
				}
				cnt = append(cnt, mc...)
			}
		}, func(err error) {
			slog.Error("error parsing", err)
		}, func() {
			slog.Info("enumerated content for folder")
		})
		for _, err := range errs {
			slog.Error("error parsing", err)
		}
		return cnt, nil
	}
	return nil, errors.Errorf("unhandled source type: %s", cs.Type)
}

func (s *Service) enumerateSource(ctx context.Context, src *content.Source, r *content.GetSourcesRequest) ([]*content.DisplayContent, error) {
	var disCnt []*content.DisplayContent
	cnt, err := s.sourceToContent(ctx, src, r)
	if err != nil {
		return nil, err
	}
	for _, cn := range cnt {
		dc := &content.DisplayContent{
			Content: cn,
		}
		switch t := cn.Type.(type) {
		case *content.Content_Post:
			dc.Title = t.Post.Title
			dc.Description = t.Post.Content
			dc.Type = "post"
		case *content.Content_Site:
			dc.Title = "site"
			dc.Description = t.Site.HugoConfig.Title
			dc.Type = "site"
		case *content.Content_Data:
			switch u := t.Data.Type.(type) {
			case *content.Data_Url:
				ul, err := url.Parse(u.Url.Url)
				if err != nil {
					return nil, err
				}
				dc.Title = ul.Hostname()
				dc.Description = ul.Path
				dc.Type = "url"
			case *content.Data_Text:
				dc.Description = u.Text.Data
				dc.Type = "text"
			}
		case *content.Content_Normalized:
			switch u := t.Normalized.Type.(type) {
			case *content.Normalized_Article:
				dc.Title = u.Article.Title
				dc.Description = u.Article.Excerpt
				dc.Type = "article"
			case *content.Normalized_Readme:
				dc.Description = u.Readme.Data
				dc.Type = "readme"
			case *content.Normalized_Transcript:
				dc.Title = u.Transcript.Name
				dc.Type = "transcript"
			}
		}
		disCnt = append(disCnt, dc)
	}
	return disCnt, nil
}

func (s *Service) GetSources(ctx context.Context, c *connect_go.Request[content.GetSourcesRequest]) (*connect_go.Response[content.Sources], error) {
	srcs := []*content.Source{
		{
			Name: "lunabrain",
			Type: &content.Source_Server{
				Server: &content.Server{},
			},
		},
		//{
		//	Name: "logseq",
		//	Type: &content.Source_Folder{
		//		Folder: &content.Folder{
		//			Path: "/Users/hacked/Documents/Github/notes/journals",
		//		},
		//	},
		//},
	}
	var enumSrc []*content.EnumeratedSource
	for _, src := range srcs {
		disCnt, err := s.enumerateSource(ctx, src, c.Msg)
		if err != nil {
			return nil, err
		}
		enumSrc = append(enumSrc, &content.EnumeratedSource{
			Source:         src,
			DisplayContent: disCnt,
		})
	}
	return connect_go.NewResponse(&content.Sources{
		Sources: enumSrc,
	}), nil
}

func (s *Service) Publish(ctx context.Context, c *connect_go.Request[content.ContentIDs]) (*connect_go.Response[content.ContentIDs], error) {
	// TODO breadchris once the flows through this code are more clear, break into smaller functions

	//bkt, err := bucket.NewBuilder(bucket.Config{
	//	Path: "/tmp/lunabrain",
	//})
	//if err != nil {
	//	return nil, err
	//}
	b := publish.NewBlog(s.builder)

	resp, err := s.Search(ctx, connect_go.NewRequest(&content.Query{
		Tags: []string{"100daystooffload"},
	}))
	if err != nil {
		return nil, err
	}

	sites, err := s.Search(ctx, connect_go.NewRequest(&content.Query{
		// TODO breadchris use type safe name
		ContentTypes: []string{"site"},
	}))
	if err != nil {
		return nil, err
	}

	// TODO breadchris only supporting one site right now
	var site *content.Site
	sc := sites.Msg.StoredContent
	if len(sc) != 1 {
		return nil, errors.Errorf("did not find exactly one site, found %d", len(sites.Msg.StoredContent))
	}
	switch t := sc[0].Content.Type.(type) {
	case *content.Content_Site:
		site = t.Site
	}
	if site == nil {
		return nil, errors.Errorf("unable to find site")
	}

	var cnt []*content.Content
	for _, sc := range resp.Msg.StoredContent {
		cnt = append(cnt, sc.Content)
	}

	err = b.Publish("blog", site, cnt)
	if err != nil {
		return nil, err
	}

	notes, err := bucket.NewBuilder(bucket.Config{
		Path: "/Users/hacked/Documents/Github/notes/pages",
	})
	if err != nil {
		return nil, err
	}

	// TODO breadchris commit changes https://chat.openai.com/share/20f66a27-51f5-4396-baf1-0a60373747b2
	l, err := notes.File("lunabrain.md")
	if err != nil {
		return nil, err
	}

	out := ""
	for _, c := range cnt {
		createdAt, err := time.Parse(time.RFC3339, c.CreatedAt)
		if err != nil {
			return nil, err
		}
		fmtDate := createdAt.Format("Jan 2th, 2006")

		var ts []string
		for _, t := range c.Tags {
			ts = append(ts, fmt.Sprintf("[[%s]]", t))
		}
		tags := strings.Join(ts, ", ")

		switch t := c.Type.(type) {
		case *content.Content_Post:
			out += fmt.Sprintf("- %s | %s\n  created-at:: [[%s]]\n  tags:: %s\n", t.Post.Title, t.Post.Summary, fmtDate, tags)
			out += fmt.Sprintf("\t- %s\n", t.Post.Content)
			out += "\n"
		}
	}

	if err = os.WriteFile(l, []byte(out), 0644); err != nil {
		return nil, err
	}

	return connect_go.NewResponse(&content.ContentIDs{ContentIds: c.Msg.GetContentIds()}), nil
}

func (s *Service) Relate(ctx context.Context, c *connect_go.Request[content.RelateRequest]) (*connect_go.Response[emptypb.Empty], error) {
	_, err := s.sess.GetUserID(ctx)
	if err != nil {
		return nil, err
	}

	// TODO breadchris make sure user has access to all content
	pid, err := uuid.Parse(c.Msg.Parent)
	if err != nil {
		return nil, errors.Wrapf(err, "unable to parse parent id")
	}

	var ids []uuid.UUID
	for _, ct := range c.Msg.Children {
		id, err := uuid.Parse(ct)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to parse content id")
		}
		ids = append(ids, id)
	}
	err = s.content.RelateContent(ctx, c.Msg.Connect, pid, ids...)
	if err != nil {
		return nil, errors.Wrapf(err, "unable to associate content")
	}
	return connect_go.NewResponse(&emptypb.Empty{}), nil
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
				slog.Debug("saved file", "url", t.File.Url)
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

func getTypeInfo(m protoreflect.ProtoMessage) (*content.GRPCTypeInfo, error) {
	ed, err := grpc.SerializeType(m)
	if err != nil {
		return nil, errors.Wrapf(err, "error serializing node type")
	}

	// TODO breadchris cleanup this code, see blocks.go:76
	tr := grpc.NewTypeResolver()
	tr = tr.ResolveLookup(m)

	sr := tr.Serialize()

	return &content.GRPCTypeInfo{
		Msg:        ed.AsDescriptorProto(),
		DescLookup: sr.DescLookup,
		EnumLookup: sr.EnumLookup,
	}, nil
}

func (s *Service) Types(ctx context.Context, c *connect_go.Request[emptypb.Empty]) (*connect_go.Response[content.TypesResponse], error) {
	cntType, err := getTypeInfo(&content.Content{})
	if err != nil {
		return nil, err
	}
	siteType, err := getTypeInfo(&content.Site{})
	if err != nil {
		return nil, err
	}
	return connect_go.NewResponse(&content.TypesResponse{
		Content: cntType,
		Site:    siteType,
	}), nil
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
		ct, err = s.content.SearchContent(ctx, userID, groupID, c.Msg)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to get stored content")
		}
	}

	var storedContent []*content.StoredContent
	for _, cn := range ct {
		var tags []*content.Tag

		// TODO breadchris how should tags be stored? in a Content or in a StoredContent?
		cn.Data.Tags = []string{}
		for _, t := range cn.Edges.Tags {
			tags = append(tags, &content.Tag{Name: t.Name})
			cn.Data.Tags = append(cn.Data.Tags, t.Name)
		}
		cn.Data.Content.CreatedAt = cn.CreatedAt.Format(time.RFC3339)
		sc := &content.StoredContent{
			Id:      cn.ID.String(),
			Content: cn.Data.Content,
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
