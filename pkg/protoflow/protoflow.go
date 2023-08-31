package protoflow

import (
	"bufio"
	"context"
	"github.com/breadchris/gosseract"
	connect_go "github.com/bufbuild/connect-go"
	whisper2 "github.com/ggerganov/whisper.cpp/bindings/go/pkg/whisper"
	"github.com/google/uuid"
	"github.com/google/wire"
	"github.com/kkdai/youtube/v2"
	genapi "github.com/lunabrain-ai/lunabrain/gen"
	"github.com/lunabrain-ai/lunabrain/gen/genconnect"
	"github.com/lunabrain-ai/lunabrain/pkg/whisper"
	"github.com/pkg/errors"
	"github.com/protoflow-labs/protoflow/gen"
	"github.com/protoflow-labs/protoflow/pkg/bucket"
	"github.com/protoflow-labs/protoflow/pkg/openai"
	"github.com/protoflow-labs/protoflow/pkg/protoflow"
	"github.com/reactivex/rxgo/v2"
	"github.com/rs/zerolog/log"
	ffmpeg "github.com/u2takey/ffmpeg-go"
	"image"
	"io"
	"os"
	"os/exec"
	"strings"
)

type Protoflow struct {
	openai openai.QAClient
}

var ProviderSet = wire.NewSet(
	New,
	NewProtoflow,
)

var _ genconnect.ProtoflowServiceHandler = (*Protoflow)(nil)

func NewProtoflow() (*protoflow.Protoflow, error) {
	// TODO breadchris pass a config provider in here
	return protoflow.Wire(bucket.Config{
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

func New(openai openai.QAClient) *Protoflow {
	return &Protoflow{
		openai: openai,
	}
}

func (p *Protoflow) DownloadYouTubeVideo(ctx context.Context, c *connect_go.Request[genapi.YouTubeVideo]) (*connect_go.Response[genapi.FilePath], error) {
	client := youtube.Client{
		Debug: true,
	}

	video, err := client.GetVideo(c.Msg.Id)
	if err != nil {
		panic(err)
	}

	// only get videos with audio
	formats := video.Formats.WithAudioChannels()
	var stream io.ReadCloser
	var contentLength int64
	for _, format := range formats {
		stream, contentLength, err = client.GetStream(video, &format)
		if err != nil {
			panic(err)
		}

		if contentLength != 0 {
			break
		}
	}
	if contentLength == 0 {
		return nil, errors.New("no stream found")
	}

	// TODO breadchris this should be written to a file store, whose directory was provided by an env var? or a config file?
	file, err := os.Create("/tmp/video.mp4")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	log.Info().Str("id", c.Msg.Id).Msg("downloading video")
	_, err = io.Copy(file, stream)
	if err != nil {
		panic(err)
	}
	log.Info().Str("id", c.Msg.Id).Msg("downloaded video")
	return connect_go.NewResponse(&genapi.FilePath{}), nil
}

// StreamObservable runs the binary "stream" and returns an Observable of its output lines.
func StreamObservable(ctx context.Context) rxgo.Observable {
	return rxgo.Create([]rxgo.Producer{func(ctx context.Context, next chan<- rxgo.Item) {
		cmd := exec.Command("stream")
		cmd.Args = append(cmd.Args, "-m", "/Users/hacked/Documents/GitHub/whisper.cpp/models/ggml-base.en.bin")
		stdout, err := cmd.StdoutPipe()
		if err != nil {
			next <- rxgo.Error(err)
			return
		}
		stderr, err := cmd.StderrPipe()
		if err != nil {
			next <- rxgo.Error(err)
			return
		}

		stdoutScan := bufio.NewScanner(stdout)
		go func() {
			for stdoutScan.Scan() {
				// TODO breadchris check if the context has been cancelled
				next <- rxgo.Of(stdoutScan.Text())
			}
		}()

		stderrScan := bufio.NewScanner(stderr)
		go func() {
			for stderrScan.Scan() {
				// TODO breadchris check if the context has been cancelled
				next <- rxgo.Of(stderrScan.Text())
			}
		}()

		err = cmd.Start()
		if err != nil {
			next <- rxgo.Error(err)
			return
		}

		err = cmd.Wait()
		if err != nil {
			next <- rxgo.Error(err)
			return
		}
	}}, rxgo.WithContext(ctx))
}

func (p *Protoflow) Chat(ctx context.Context, c *connect_go.Request[genapi.ChatRequest], c2 *connect_go.ServerStream[genapi.ChatResponse]) error {
	observable := StreamObservable(ctx)
	listening := false
	for item := range observable.Observe() {
		if item.Error() {
			continue
		}
		if item.V == nil {
			continue
		}

		if strings.HasPrefix(item.V.(string), "main:") {
			listening = true
			continue
		}
		if strings.Contains(item.V.(string), "BLANK_AUDIO") {
			continue
		}
		if !listening {
			log.Info().Str("message", item.V.(string)).Msg("not listening")
			continue
		}
		log.Info().Str("message", item.V.(string)).Msg("listening")
		if err := c2.Send(&genapi.ChatResponse{
			Message: item.V.(string),
		}); err != nil {
			return err
		}
	}
	return nil
}

func (p *Protoflow) ConvertFile(ctx context.Context, c *connect_go.Request[genapi.ConvertFileRequest]) (*connect_go.Response[genapi.FilePath], error) {
	err := ffmpeg.Input(c.Msg.From).
		Output(c.Msg.To, ffmpeg.KwArgs{"ar": "16000", "ac": "1"}).
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

func (p *Protoflow) LiveTranscribe(ctx context.Context, c *connect_go.Request[genapi.TranscriptionRequest], c2 *connect_go.ServerStream[genapi.Segment]) error {
	model, err := whisper2.New(c.Msg.Model)
	if err != nil {
		return err
	}
	defer model.Close()

	obs, err := whisper.Process(model, c.Msg.FilePath, c.Msg)
	if err != nil {
		return err
	}
	<-obs.ForEach(func(item any) {
		t, ok := item.(*genapi.Segment)
		if !ok {
			return
		}
		err = c2.Send(t)
		if err != nil {
			log.Error().Err(err).Msg("error sending token")
		}
	}, func(err error) {
		log.Error().Err(err).Msg("error in observable")
	}, func() {
	})
	return nil
}

func (p *Protoflow) Transcribe(ctx context.Context, c *connect_go.Request[genapi.TranscriptionRequest]) (*connect_go.Response[genapi.Transcription], error) {
	whisper.Stream()
	return nil, nil
}
