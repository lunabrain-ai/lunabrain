package protoflow

import (
	"bytes"
	"context"
	connect_go "github.com/bufbuild/connect-go"
	"github.com/google/uuid"
	"github.com/google/wire"
	"github.com/kkdai/youtube/v2"
	genapi "github.com/lunabrain-ai/lunabrain/gen"
	"github.com/lunabrain-ai/lunabrain/gen/content"
	"github.com/lunabrain-ai/lunabrain/gen/genconnect"
	"github.com/lunabrain-ai/lunabrain/pkg/bucket"
	"github.com/lunabrain-ai/lunabrain/pkg/db"
	"github.com/lunabrain-ai/lunabrain/pkg/db/model"
	"github.com/lunabrain-ai/lunabrain/pkg/openai"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/collect"
	"github.com/lunabrain-ai/lunabrain/pkg/util"
	"github.com/lunabrain-ai/lunabrain/pkg/whisper"
	"github.com/pkg/errors"
	"github.com/reactivex/rxgo/v2"
	ffmpeg "github.com/u2takey/ffmpeg-go"
	"gorm.io/datatypes"
	"image"
	"io"
	"log/slog"
	ghttp "net/http"
	"net/url"
	"os"
	"path"
	"time"
)

type Protoflow struct {
	openai    *openai.Agent
	sess      *db.Session
	fileStore *bucket.Bucket
	config    Config
	whisper   *whisper.Client
	db        *db.Store
}

var ProviderSet = wire.NewSet(
	New,
	NewConfig,
)

var _ genconnect.ProtoflowServiceHandler = (*Protoflow)(nil)

//func NewProtoflow() (*protoflow.Protoflow, error) {
//	// TODO breadchris pass a config provider in here
//	return protoflow.Wire(pbucket.Config{
//		Name: ".lunabrain",
//	}, &gen.Project{
//		Id:   uuid.NewString(),
//		Name: "test",
//		Graph: &gen.Graph{
//			Nodes: []*gen.Node{},
//			Edges: []*gen.Edge{},
//		},
//	})
//}

func New(
	openai *openai.Agent,
	sess *db.Session,
	fileStore *bucket.Bucket,
	config Config,
	whisper *whisper.Client,
) *Protoflow {
	return &Protoflow{
		openai:    openai,
		sess:      sess,
		fileStore: fileStore,
		config:    config,
		whisper:   whisper,
	}
}

func (p *Protoflow) NewPrompt(ctx context.Context, c *connect_go.Request[genapi.Prompt]) (*connect_go.Response[genapi.Prompt], error) {
	s, err := p.sess.NewPrompt(c.Msg)
	return connect_go.NewResponse(&genapi.Prompt{
		Id:   s.ID.String(),
		Text: s.Data.Data.Text,
	}), err
}

func (p *Protoflow) GetPrompts(ctx context.Context, c *connect_go.Request[genapi.GetPromptsRequest]) (*connect_go.Response[genapi.GetPromptsResponse], error) {
	// TODO breadchris handle pages
	sessions, _, err := p.sess.AllPrompts(0, 100)
	if err != nil {
		return nil, err
	}
	var ps []*genapi.Prompt
	for _, s := range sessions {
		d := s.Data.Data
		d.Id = s.ID.String()
		ps = append(ps, d)
	}
	return connect_go.NewResponse(&genapi.GetPromptsResponse{
		Prompts: ps,
	}), nil
}

func (p *Protoflow) DownloadYouTubeVideo(ctx context.Context, c *connect_go.Request[genapi.YouTubeVideo]) (*connect_go.Response[genapi.YouTubeVideoResponse], error) {
	client := youtube.Client{
		Debug: true,
	}

	video, err := client.GetVideoContext(ctx, c.Msg.Id)
	if err != nil {
		return nil, err
	}

	// TODO breadchris will this error if it can't find the transcript
	vt, err := client.GetTranscriptCtx(ctx, video)
	if err != nil {
		return nil, err
	}

	var segments []*genapi.Segment
	for i, seg := range vt {
		segments = append(segments, &genapi.Segment{
			Num:       uint32(i),
			Text:      seg.Text,
			StartTime: uint64(seg.StartMs),
			EndTime:   uint64(seg.StartMs + seg.Duration),
		})
	}

	if len(segments) > 0 {
		return connect_go.NewResponse(&genapi.YouTubeVideoResponse{
			Title:      video.Title,
			Transcript: segments,
		}), nil
	}

	// TODO breadchris support more formats
	format := video.Formats.Type("audio").FindByQuality("tiny")
	if format == nil {
		return nil, errors.Wrapf(err, "no audio format found for tiny")
	}
	stream, contentLength, err := client.GetStream(video, format)
	if contentLength == 0 {
		return nil, errors.New("no stream found")
	}

	var filename string
	if c.Msg.File != "" {
		filename = c.Msg.File
	} else {
		filename = c.Msg.Id
	}

	w, err := p.fileStore.Bucket.NewWriter(ctx, filename, nil)
	if err != nil {
		return nil, err
	}
	defer w.Close()

	filepath, err := p.fileStore.NewFile(filename)
	if err != nil {
		return nil, err
	}

	slog.Info("downloading video", "id", c.Msg.Id, "size", contentLength)
	_, err = io.Copy(w, stream)
	if err != nil {
		panic(err)
	}
	slog.Info("downloaded video", "id", c.Msg.Id, "size", contentLength)
	return connect_go.NewResponse(&genapi.YouTubeVideoResponse{
		Title: video.Title,
		FilePath: &genapi.FilePath{
			File: filepath,
		},
		Transcript: segments,
	}), nil
}

func (p *Protoflow) GetSessions(ctx context.Context, c *connect_go.Request[genapi.GetSessionsRequest]) (*connect_go.Response[genapi.GetSessionsResponse], error) {
	id, err := p.sess.GetUserID(ctx)
	if err != nil {
		return nil, err
	}

	// TODO breadchris handle paging
	sessions, _, err := p.sess.All(id, int(c.Msg.Page), int(c.Msg.Limit))
	if err != nil {
		return nil, err
	}
	var sessionsProto []*genapi.Session
	for _, s := range sessions {
		d := s.Data.Data
		d.Id = s.ID.String()
		sessionsProto = append(sessionsProto, d)
	}
	return connect_go.NewResponse(&genapi.GetSessionsResponse{
		Sessions: sessionsProto,
	}), nil
}

func (p *Protoflow) GetSession(ctx context.Context, c *connect_go.Request[genapi.GetSessionRequest]) (*connect_go.Response[genapi.GetSessionResponse], error) {
	m, err := p.sess.Get(c.Msg.Id)
	if err != nil {
		return nil, err
	}
	s := m.Data.Data
	s.Id = m.ID.String()
	for _, seg := range m.Segments {
		s.Segments = append(s.Segments, seg.Data.Data)
	}
	return connect_go.NewResponse(&genapi.GetSessionResponse{
		Session: m.Data.Data,
	}), nil
}

func (p *Protoflow) DeleteSession(ctx context.Context, c *connect_go.Request[genapi.DeleteSessionRequest]) (*connect_go.Response[genapi.Empty], error) {
	err := p.sess.DeleteSession(c.Msg.Id)
	return connect_go.NewResponse(&genapi.Empty{}), err
}

func (p *Protoflow) observeSegments(
	s *model.Session,
	obs rxgo.Observable,
	c2 *connect_go.ServerStream[genapi.ChatResponse],
) {
	<-obs.ForEach(func(item any) {
		t, ok := item.(*genapi.Segment)
		if !ok {
			return
		}

		err := p.sess.SaveSegment(&model.Segment{
			SessionID: s.ID,
			Data: datatypes.JSONType[*genapi.Segment]{
				Data: t,
			},
		})
		if err != nil {
			slog.Error("error saving segment", "error", err)
		}

		if err := c2.Send(&genapi.ChatResponse{
			Segment: t,
		}); err != nil {
			slog.Error("error sending token", "error", err)
		}
	}, func(err error) {
		slog.Error("error in observable", "error", err)
	}, func() {
		slog.Info("transcription complete")
	})
}

func (p *Protoflow) Chat(ctx context.Context, c *connect_go.Request[genapi.ChatRequest], c2 *connect_go.ServerStream[genapi.ChatResponse]) error {
	id, err := p.sess.GetUserID(ctx)
	if err != nil {
		return err
	}

	s, err := p.sess.NewSession(id, &genapi.Session{
		Name: "live chat",
	})
	if err != nil {
		return err
	}
	obs := p.whisper.Transcribe(ctx, id, "", c.Msg.CaptureDevice)
	p.observeSegments(s, obs, c2)
	return nil
}

func (p *Protoflow) convertAudio(ctx context.Context, filepath string) error {
	converted := filepath + ".wav"
	_, err := p.ConvertFile(ctx, &connect_go.Request[genapi.ConvertFileRequest]{
		Msg: &genapi.ConvertFileRequest{
			From: filepath,
			To:   converted,
		},
	})
	if err != nil {
		return err
	}
	// TODO breadchris moving the file back to the original file name until
	// file chain of custody is implemented
	err = os.Rename(converted, filepath)
	if err != nil {
		return err
	}
	return nil
}

func (p *Protoflow) UploadContent(ctx context.Context, c *connect_go.Request[genapi.UploadContentRequest], c2 *connect_go.ServerStream[genapi.ChatResponse]) error {
	var (
		obs  rxgo.Observable
		name = time.Now().String()
		id   = uuid.NewString()
	)

	userID, err := p.sess.GetUserID(ctx)
	if err != nil {
		return err
	}

	switch u := c.Msg.Content.Type.(type) {
	case *content.Content_Data:
		switch t := u.Data.Type.(type) {
		case *content.Data_Url:
			u, err := url.Parse(t.Url.Url)
			if err != nil {
				return err
			}
			s, err := util.RemoveSubdomains(u.Host)
			if err != nil {
				return err
			}
			switch s {
			case "youtube.com":
				slog.Debug("downloading youtube video", "host", u.Host, "id", u.Query().Get("v"))
				r, err := p.DownloadYouTubeVideo(ctx, &connect_go.Request[genapi.YouTubeVideo]{
					Msg: &genapi.YouTubeVideo{
						Id:   u.Query().Get("v"),
						File: id,
					},
				})
				if err != nil {
					return err
				}
				if r.Msg.Transcript == nil {
					err = p.convertAudio(ctx, r.Msg.FilePath.File)
					if err != nil {
						return err
					}
					obs = p.whisper.Transcribe(ctx, id, r.Msg.FilePath.File, 0)
				} else {
					obs = rxgo.Create([]rxgo.Producer{func(ctx context.Context, next chan<- rxgo.Item) {
						for _, seg := range r.Msg.Transcript {
							next <- rxgo.Of(seg)
						}
					}}, rxgo.WithContext(ctx))
				}
				name = r.Msg.Title
			default:
				return errors.New("unsupported url")
			}
			break
		case *content.Data_File:
			name = t.File.File

			err := p.fileStore.Bucket.WriteAll(ctx, id, t.File.Data, nil)
			filepath, err := p.fileStore.NewFile(id)
			if err != nil {
				return err
			}

			isAudio := false

			contentType := ghttp.DetectContentType(t.File.Data)
			switch contentType {
			case "audio/wave":
				isAudio = true
			case "application/pdf":
				r := bytes.NewReader(t.File.Data)
				pd := collect.NewPDF(r, int64(len(t.File.Data)))
				obs = rxgo.Create([]rxgo.Producer{func(ctx context.Context, next chan<- rxgo.Item) {
					pages, err := pd.Load(ctx)
					if err != nil {
						next <- rxgo.Error(err)
						return
					}

					for i, page := range pages {
						seg := genapi.Segment{
							Num:  uint32(i),
							Text: page.PageContent,
						}
						next <- rxgo.Of(&seg)
					}
				}}, rxgo.WithContext(ctx))
			case "text/plain; charset=utf-8":
				obs = rxgo.Create([]rxgo.Producer{func(ctx context.Context, next chan<- rxgo.Item) {
					seg := genapi.Segment{
						Num:  0,
						Text: string(t.File.Data),
					}
					next <- rxgo.Of(&seg)
				}}, rxgo.WithContext(ctx))
			default:
				// TODO breadchris m4a is not a mime type in the golang mime package
				if path.Ext(name) == ".m4a" {
					err = p.convertAudio(ctx, filepath)
					if err != nil {
						return err
					}
					isAudio = true
				} else {
					return errors.Errorf("unsupported file type: %s", contentType)
				}
			}
			if isAudio {
				obs = p.whisper.Transcribe(ctx, id, filepath, 0)
			}

			if err != nil {
				return err
			}
			break
		case *content.Data_Text:
			obs = rxgo.Create([]rxgo.Producer{func(ctx context.Context, next chan<- rxgo.Item) {
				seg := genapi.Segment{
					Num:  0,
					Text: t.Text.Data,
				}
				next <- rxgo.Of(&seg)
			}}, rxgo.WithContext(ctx))
		}
	default:
		return errors.New("invalid content type")
	}
	if obs == nil {
		return errors.New("no observable")
	}

	s, err := p.sess.NewSession(userID, &genapi.Session{
		Id:   id,
		Name: name,
	})
	if err != nil {
		return err
	}

	p.observeSegments(s, obs, c2)
	return nil
}

func (p *Protoflow) ConvertFile(ctx context.Context, c *connect_go.Request[genapi.ConvertFileRequest]) (*connect_go.Response[genapi.FilePath], error) {
	err := ffmpeg.Input(c.Msg.From).
		Output(c.Msg.To, ffmpeg.KwArgs{"ar": "16000", "ac": "1", "f": "wav"}).
		OverWriteOutput().ErrorToStdOut().Run()
	if err != nil {
		return nil, err
	}
	return connect_go.NewResponse(&genapi.FilePath{
		File: c.Msg.To,
	}), nil
}

func loadImageFromFile(imgPath string) image.Image {
	imageFile, _ := os.Open(imgPath)
	defer imageFile.Close()
	img, _, _ := image.Decode(imageFile)
	return img
}

func (p *Protoflow) GenerateImages(ctx context.Context, c *connect_go.Request[genapi.GenerateImagesRequest]) (*connect_go.Response[genapi.GenerateImagesResponse], error) {
	images, err := p.openai.GenerateImages(ctx, c.Msg.Prompt)
	if err != nil {
		return nil, err
	}
	return connect_go.NewResponse(&genapi.GenerateImagesResponse{
		Images: images,
	}), nil
}

//func (p *Protoflow) OCR(ctx context.Context, c *connect_go.Request[genapi.FilePath]) (*connect_go.Response[genapi.OCRText], error) {
//	log.Info().Str("file", c.Msg.File).Msg("ocr")
//	client := gosseract.NewClient()
//	defer client.Close()
//
//	err := client.SetImage(c.Msg.File)
//	if err != nil {
//		return nil, err
//	}
//
//	text, err := client.Text()
//	if err != nil {
//		return nil, err
//	}
//
//	return connect_go.NewResponse(&genapi.OCRText{
//		Text: text,
//	}), nil
//}
