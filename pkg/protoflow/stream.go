package protoflow

import (
	"bufio"
	"context"
	"encoding/json"
	genapi "github.com/lunabrain-ai/lunabrain/gen"
	"github.com/pkg/errors"
	"github.com/reactivex/rxgo/v2"
	"github.com/rs/zerolog/log"
	"os"
	"os/exec"
)

const (
	transModel = "models/ggml-base.en.bin"
)

func (p *Protoflow) StreamTranscription(ctx context.Context, file string) rxgo.Observable {
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
				"-c", "0",
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
