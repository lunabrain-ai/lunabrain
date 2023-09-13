package whisper

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"github.com/google/wire"
	genapi "github.com/lunabrain-ai/lunabrain/gen"
	"github.com/lunabrain-ai/lunabrain/pkg/openai"
	"github.com/lunabrain-ai/lunabrain/pkg/store/bucket"
	"github.com/pkg/errors"
	"github.com/reactivex/rxgo/v2"
	"github.com/rs/zerolog/log"
	"io"
	"mime/multipart"
	"net/http"
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
	if a.config.Offline {
		return a.offlineTranscription(ctx, filePath, captureDevice)
	} else {
		return a.apiTranscription(ctx, id, filePath)
	}
}

func (a *Client) apiTranscription(ctx context.Context, id, filePath string) rxgo.Observable {
	// TODO breadchris figure out what code should be in the producer
	return rxgo.Create([]rxgo.Producer{func(ctx context.Context, next chan<- rxgo.Item) {
		// TODO breadchris maybe support streams instead of just files?
		err := a.splitWAVFile(id, maxChunkSize, filePath, func(chunkFilePath string) error {
			req, err := a.reqFromFile(chunkFilePath)
			if err != nil {
				return errors.Wrapf(err, "failed to create request from file %s", chunkFilePath)
			}

			client := &http.Client{}
			resp, err := client.Do(req.WithContext(ctx))
			if err != nil {
				return errors.Wrapf(err, "failed to make request from file %s", chunkFilePath)
			}
			defer resp.Body.Close()

			log.Debug().Msgf("Status: %s\n", resp.Status)

			respBody, err := io.ReadAll(resp.Body)
			if err != nil {
				return errors.Wrapf(err, "failed to read response body from file %s", chunkFilePath)
			}
			log.Debug().Msgf("Response: %s\n", respBody)
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

		log.Debug().
			Str("cmd", cmd.String()).
			Msg("running stream")
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
				log.Debug().Str("stderr", stderrScan.Text()).Msg("stream")
			}
		}()

		err = cmd.Start()
		if err != nil {
			next <- rxgo.Error(err)
			return
		}

		go func() {
			<-ctx.Done()
			log.Info().Msg("killing stream")
			cmd.Process.Kill()
		}()

		err = cmd.Wait()
		if err != nil {
			next <- rxgo.Error(err)
			return
		}
	}}, rxgo.WithContext(ctx))
}

func (a *Client) reqFromFile(filePath string) (*http.Request, error) {
	var requestBody bytes.Buffer

	writer := multipart.NewWriter(&requestBody)

	file, err := os.Open(filePath)
	if err != nil {
		return nil, errors.Wrapf(err, "failed to open file %s", filePath)
	}
	defer file.Close()

	formFileWriter, err := writer.CreateFormFile("file", file.Name())
	if err != nil {
		return nil, errors.Wrapf(err, "failed to create form file for %s", file.Name())
	}

	_, err = io.Copy(formFileWriter, file)
	if err != nil {
		return nil, errors.Wrapf(err, "failed to copy file %s", file.Name())
	}

	err = writer.WriteField("model", "whisper-1")
	if err != nil {
		return nil, errors.Wrapf(err, "failed to write model field")
	}

	err = writer.Close()
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", "https://api.openai.com/v1/audio/transcriptions", &requestBody)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("Authorization", "Bearer "+a.openaiConfig.APIKey)
	return req, nil
}
