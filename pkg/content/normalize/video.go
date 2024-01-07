package normalize

import (
	"context"
	connect_go "github.com/bufbuild/connect-go"
	"github.com/kkdai/youtube/v2"
	genapi "github.com/lunabrain-ai/lunabrain/pkg/gen"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/content"
	"github.com/pkg/errors"
	ffmpeg "github.com/u2takey/ffmpeg-go"
	"io"
	"log/slog"
)

func cutVideoSection(inputFile, outputFile string, startTime, duration int) error {
	return ffmpeg.Input(inputFile, ffmpeg.KwArgs{"ss": startTime}).
		Output(outputFile, ffmpeg.KwArgs{"t": duration}).
		OverWriteOutput().
		Run()
}

func (s *Normalize) DownloadYouTubeVideo(ctx context.Context, c *connect_go.Request[genapi.YouTubeVideo]) (*connect_go.Response[genapi.YouTubeVideoResponse], error) {
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

	var segments []*content.Segment
	for i, seg := range vt {
		segments = append(segments, &content.Segment{
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

	w, err := s.fileStore.Bucket.NewWriter(ctx, filename, nil)
	if err != nil {
		return nil, err
	}
	defer w.Close()

	filepath, err := s.fileStore.NewFile(filename)
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
