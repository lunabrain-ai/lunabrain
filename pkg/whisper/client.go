package whisper

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"github.com/google/wire"
	genapi "github.com/lunabrain-ai/lunabrain/gen"
	"github.com/lunabrain-ai/lunabrain/pkg/bucket"
	"github.com/lunabrain-ai/lunabrain/pkg/openai"
	"github.com/pkg/errors"
	"github.com/reactivex/rxgo/v2"
	gopenai "github.com/sashabaranov/go-openai"
	"log/slog"
	"os"
	"os/exec"
)

const (
	transModel   = "models/ggml-base.en.bin"
	maxChunkSize = 25 * 1024 * 1024 // 25 MB in bytes
)

type Client struct {
	config       Config
	openaiConfig openai.Config
	fileStore    *bucket.Bucket
}

var ProviderSet = wire.NewSet(
	NewConfig,
	NewClient,
)

func NewClient(
	config Config,
	openaiConfig openai.Config,
	fileStore *bucket.Bucket,
) *Client {
	return &Client{
		config:       config,
		openaiConfig: openaiConfig,
		fileStore:    fileStore,
	}
}

// TODO breadchris captureDevice seems awkward here
func (a *Client) Transcribe(ctx context.Context, id, filePath string, captureDevice int32) rxgo.Observable {
	slog.Debug("transcribing audio with whisper", "id", id, "filePath", filePath)
	if a.config.Offline {
		return a.offlineTranscription(ctx, filePath, captureDevice)
	} else {
		return a.apiTranscription(ctx, id, filePath)
	}
}

func (a *Client) apiTranscription(ctx context.Context, id string, filePath string) rxgo.Observable {
	c := gopenai.NewClient(a.openaiConfig.APIKey)

	// TODO breadchris figure out what code should be in the producer
	return rxgo.Create([]rxgo.Producer{func(ctx context.Context, next chan<- rxgo.Item) {
		// TODO breadchris maybe support streams instead of just files?
		var duration float64
		err := splitWAVFile(a.fileStore, id, filePath, maxChunkSize, func(chunkFilePath string) error {
			slog.Debug("transcribing chunk", "id", id, "chunkFilePath", chunkFilePath)

			req := gopenai.AudioRequest{
				FilePath: chunkFilePath,
				Model:    gopenai.Whisper1,
				Format:   gopenai.AudioResponseFormatVerboseJSON,
			}
			res, err := c.CreateTranscription(ctx, req)
			if err != nil {
				return err
			}

			duration += res.Duration

			for _, s := range res.Segments {
				seg := genapi.Segment{
					Num:       uint32(s.ID),
					Text:      s.Text,
					StartTime: uint64(duration + s.Start),
					EndTime:   uint64(duration + s.End),
				}
				next <- rxgo.Of(&seg)
			}

			slog.Debug("transcription done", "id", id)
			return nil
		})
		if err != nil {
			next <- rxgo.Error(err)
			return
		}
	}}, rxgo.WithContext(ctx))
}

func (a *Client) offlineTranscription(ctx context.Context, file string, captureDevice int32) rxgo.Observable {
	return rxgo.Create([]rxgo.Producer{func(ctx context.Context, next chan<- rxgo.Item) {
		cmd := exec.Command("third_party/whisper.cpp/stream")
		_, err := os.Stat(transModel)
		if err != nil {
			next <- rxgo.Error(errors.Wrapf(err, "failed to stat model %s", transModel))
			return
		}

		if file != "" {
			cmd.Args = append(cmd.Args, "main", "-owts", "-f", file)
		} else {
			cmd.Args = append(
				cmd.Args,
				"stream",
				// TODO breadchris offer selection for input stream
				"-c", fmt.Sprintf("%d", captureDevice),
			)
		}
		cmd.Args = append(
			cmd.Args,
			"-m", transModel,
		)

		slog.Debug("running stream", "cmd", cmd.String())
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
				var seg genapi.Segment
				if err := json.Unmarshal([]byte(stdoutScan.Text()), &seg); err != nil {
					next <- rxgo.Error(err)
					continue
				}
				next <- rxgo.Of(&seg)
			}
		}()

		stderrScan := bufio.NewScanner(stderr)
		go func() {
			for stderrScan.Scan() {
				// next <- rxgo.Of(stderrScan.Text())
				slog.Debug(stderrScan.Text(), "stream")
			}
		}()

		err = cmd.Start()
		if err != nil {
			next <- rxgo.Error(err)
			return
		}

		go func() {
			<-ctx.Done()
			slog.Info("killing stream")
			cmd.Process.Kill()
		}()

		err = cmd.Wait()
		if err != nil {
			next <- rxgo.Error(err)
			return
		}
	}}, rxgo.WithContext(ctx))
}
