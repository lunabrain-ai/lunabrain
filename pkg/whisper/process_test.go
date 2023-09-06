package whisper

import (
	whisper2 "github.com/ggerganov/whisper.cpp/bindings/go/pkg/whisper"
	genapi "github.com/lunabrain-ai/lunabrain/gen"
	"github.com/rs/zerolog/log"
	"testing"
)

func TestProcess(t *testing.T) {
	m, err := whisper2.New("../../third_party/whisper.cpp/models/ggml-base.en.bin")
	if err != nil {
		t.Fatal("could not load model", err)
	}
	defer m.Close()

	obs, err := Process(m, "/Users/hacked/Documents/GitHub/lunabrain/data/presentation.wav", &genapi.TranscriptionRequest{})
	if err != nil {
		t.Fatal("could not process", err)
	}
	<-obs.ForEach(func(item any) {
		t, ok := item.(*genapi.Segment)
		if !ok {
			return
		}

		for _, token := range t.Tokens {
			log.Info().
				Uint64("seg start", t.StartTime).
				Uint64("start time", token.StartTime).
				Uint64("end time", token.EndTime).
				Msg("token")
		}
	}, func(err error) {
		log.Error().Err(err).Msg("error in observable")
	}, func() {
		log.Info().Msg("transcription complete")
	})
}
