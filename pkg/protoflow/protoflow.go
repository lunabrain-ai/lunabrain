package protoflow

import (
	"context"
	"github.com/breadchris/gosseract"
	connect_go "github.com/bufbuild/connect-go"
	whisper2 "github.com/ggerganov/whisper.cpp/bindings/go/pkg/whisper"
	"github.com/google/uuid"
	"github.com/google/wire"
	"github.com/kkdai/youtube/v2"
	genapi "github.com/lunabrain-ai/lunabrain/gen"
	"github.com/lunabrain-ai/lunabrain/gen/genconnect"
	"github.com/lunabrain-ai/lunabrain/pkg/store/bucket"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db/model"
	"github.com/lunabrain-ai/lunabrain/pkg/util"
	"github.com/lunabrain-ai/lunabrain/pkg/whisper"
	"github.com/pkg/errors"
	"github.com/protoflow-labs/protoflow/gen"
	pbucket "github.com/protoflow-labs/protoflow/pkg/bucket"
	"github.com/protoflow-labs/protoflow/pkg/openai"
	"github.com/protoflow-labs/protoflow/pkg/protoflow"
	"github.com/reactivex/rxgo/v2"
	"github.com/rs/zerolog/log"
	gopenai "github.com/sashabaranov/go-openai"
	ffmpeg "github.com/u2takey/ffmpeg-go"
	"gorm.io/datatypes"
	"image"
	"io"
	"net/url"
	"os"
	"path"
	"time"
)

type Protoflow struct {
	openai       openai.QAClient
	sessionStore *db.Session
	fileStore    *bucket.Bucket
}

var ProviderSet = wire.NewSet(
	New,
	NewProtoflow,
)

var _ genconnect.ProtoflowServiceHandler = (*Protoflow)(nil)

func NewProtoflow() (*protoflow.Protoflow, error) {
	// TODO breadchris pass a config provider in here
	return protoflow.Wire(pbucket.Config{
		Name: ".lunabrain",
	}, &gen.Project{
		Id:   uuid.NewString(),
		Name: "test",
		Graph: &gen.Graph{
			Nodes: []*gen.Node{},
			Edges: []*gen.Edge{},
		},
	})
}

func New(
	openai openai.QAClient,
	sessionStore *db.Session,
	fileStore *bucket.Bucket,
) *Protoflow {
	return &Protoflow{
		openai:       openai,
		sessionStore: sessionStore,
		fileStore:    fileStore,
	}
}

func (p *Protoflow) GetPrompts(ctx context.Context, c *connect_go.Request[genapi.GetPromptsRequest]) (*connect_go.Response[genapi.GetPromptsResponse], error) {
	//TODO implement me
	panic("implement me")
}

func (p *Protoflow) Infer(ctx context.Context, c *connect_go.Request[genapi.InferRequest], c2 *connect_go.ServerStream[genapi.InferResponse]) error {
	var chat []gopenai.ChatCompletionMessage

	for _, t := range c.Msg.Text {
		chat = append(chat, gopenai.ChatCompletionMessage{
			Role:    "user",
			Content: t,
		})
	}
	chat = append(chat, gopenai.ChatCompletionMessage{
		Role:    "user",
		Content: c.Msg.Prompt,
	})

	obs, err := p.openai.StreamResponse(chat)
	if err != nil {
		return err
	}
	<-obs.ForEach(func(item any) {
		t, ok := item.(string)
		if !ok {
			return
		}
		if err := c2.Send(&genapi.InferResponse{
			Text: t,
		}); err != nil {
			log.Error().Err(err).Msg("error sending token")
		}
	}, func(err error) {
		log.Error().Err(err).Msg("error in observable")
	}, func() {
	})
	return nil
}

func (p *Protoflow) DownloadYouTubeVideo(ctx context.Context, c *connect_go.Request[genapi.YouTubeVideo]) (*connect_go.Response[genapi.FilePath], error) {
	client := youtube.Client{
		Debug: true,
	}

	video, err := client.GetVideo(c.Msg.Id)
	if err != nil {
		panic(err)
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

	w, err := p.fileStore.Bucket.NewWriter(ctx, c.Msg.Id, nil)
	if err != nil {
		return nil, err
	}
	defer w.Close()

	filepath, err := p.fileStore.NewFile(c.Msg.Id)
	if err != nil {
		return nil, err
	}

	log.Info().Str("id", c.Msg.Id).Msg("downloading video")
	_, err = io.Copy(w, stream)
	if err != nil {
		panic(err)
	}
	log.Info().Str("id", c.Msg.Id).Msg("downloaded video")
	return connect_go.NewResponse(&genapi.FilePath{
		Title: video.Title,
		File:  filepath,
	}), nil
}

func (p *Protoflow) GetSessions(ctx context.Context, c *connect_go.Request[genapi.GetSessionsRequest]) (*connect_go.Response[genapi.GetSessionsResponse], error) {
	// TODO breadchris handle page
	sessions, _, err := p.sessionStore.All(int(c.Msg.Page), int(c.Msg.Limit))
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
	m, err := p.sessionStore.Get(c.Msg.Id)
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

		err := p.sessionStore.SaveSegment(&model.Segment{
			SessionID: s.ID,
			Data: datatypes.JSONType[*genapi.Segment]{
				Data: t,
			},
		})
		if err != nil {
			log.Error().Err(err).Msg("error saving segment")
		}

		if err := c2.Send(&genapi.ChatResponse{
			Segment: t,
		}); err != nil {
			log.Error().Err(err).Msg("error sending token")
		}
	}, func(err error) {
		log.Error().Err(err).Msg("error in observable")
	}, func() {
		log.Info().Msg("transcription complete")
	})
}

func (p *Protoflow) Chat(ctx context.Context, c *connect_go.Request[genapi.ChatRequest], c2 *connect_go.ServerStream[genapi.ChatResponse]) error {
	obs := p.StreamTranscription(ctx)
	s, err := p.sessionStore.NewSession(&genapi.Session{
		Name: "live chat",
	})
	if err != nil {
		return err
	}
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

	transcriptFromFile := func(filepath string) (rxgo.Observable, error) {
		m, err := whisper2.New("third_party/whisper.cpp/models/ggml-base.en.bin")
		if err != nil {
			return nil, err
		}
		defer m.Close()

		obs, err = whisper.Process(m, filepath, &genapi.TranscriptionRequest{})
		if err != nil {
			return nil, err
		}
		return obs, nil
	}

	switch t := c.Msg.Content.Options.(type) {
	case *genapi.Content_UrlOptions:
		u, err := url.Parse(t.UrlOptions.Url)
		if err != nil {
			return err
		}
		s, err := util.RemoveSubdomains(u.Host)
		if err != nil {
			return err
		}
		switch s {
		case "youtube.com":
			log.Debug().
				Str("host", u.Host).
				Str("id", u.Query().Get("v")).
				Msg("downloading youtube video")
			r, err := p.DownloadYouTubeVideo(ctx, &connect_go.Request[genapi.YouTubeVideo]{
				Msg: &genapi.YouTubeVideo{
					Id: u.Query().Get("v"),
				},
			})
			if err != nil {
				return err
			}
			err = p.convertAudio(ctx, r.Msg.File)
			if err != nil {
				return err
			}
			obs, err = transcriptFromFile(r.Msg.File)
			if err != nil {
				return err
			}
		default:
			return errors.New("unsupported url")
		}
		break
	case *genapi.Content_AudioOptions:
		name = t.AudioOptions.File

		err := p.fileStore.Bucket.WriteAll(ctx, id, t.AudioOptions.Data, nil)
		filepath, err := p.fileStore.NewFile(id)
		if err != nil {
			return err
		}

		// TODO breadchris figure out what type of file this content is and try to convert it
		// use a more robust way of determining file type
		if path.Ext(name) == ".m4a" {
			err = p.convertAudio(ctx, filepath)
			if err != nil {
				return err
			}
		}

		obs, err = transcriptFromFile(filepath)
		if err != nil {
			return err
		}
		break
	case *genapi.Content_TextOptions:
		break
	}
	if obs == nil {
		return errors.New("no observable")
	}

	s, err := p.sessionStore.NewSession(&genapi.Session{
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

func (p *Protoflow) OCR(ctx context.Context, c *connect_go.Request[genapi.FilePath]) (*connect_go.Response[genapi.OCRText], error) {
	log.Info().Str("file", c.Msg.File).Msg("ocr")
	client := gosseract.NewClient()
	defer client.Close()

	err := client.SetImage(c.Msg.File)
	if err != nil {
		return nil, err
	}

	text, err := client.Text()
	if err != nil {
		return nil, err
	}

	return connect_go.NewResponse(&genapi.OCRText{
		Text: text,
	}), nil
}
