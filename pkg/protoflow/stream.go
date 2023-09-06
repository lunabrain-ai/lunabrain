package protoflow

import (
	"bufio"
	"context"
	"encoding/json"
	genapi "github.com/lunabrain-ai/lunabrain/gen"
	"github.com/reactivex/rxgo/v2"
	"github.com/rs/zerolog/log"
	"os/exec"
)

func (p *Protoflow) StreamTranscription(ctx context.Context) rxgo.Observable {
	return rxgo.Create([]rxgo.Producer{func(ctx context.Context, next chan<- rxgo.Item) {
		cmd := exec.Command("third_party/whisper.cpp/stream")
		cmd.Args = append(
			cmd.Args,
			"-m", "third_party/whisper.cpp/models/ggml-base.en.bin",
			// TODO breadchris offer selection for input stream
			"-c", "0",
		)
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
