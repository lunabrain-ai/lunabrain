package whisper

///*
//#cgo CPPFLAGS: `sdl2-config --cflags` -I/Users/hacked/Documents/GitHub/whisper.cpp
//#cgo LDFLAGS: -lwhisper -lm -lstdc++ -L/opt/homebrew/lib `sdl2-config --libs" -L/Users/hacked/Documents/GitHub/whisper.cpp
//#cgo darwin LDFLAGS: -framework Accelerate
//#include "wrap_stream.hxx"
//*/
//import "C"

import (
	"fmt"
	whisper2 "github.com/ggerganov/whisper.cpp/bindings/go/pkg/whisper"
	"github.com/lunabrain-ai/lunabrain/gen"
	"github.com/reactivex/rxgo/v2"
	"github.com/rs/zerolog/log"
	"io"
	"os"
	"time"

	wav "github.com/go-audio/wav"
)

// TODO breadchris this should be RegisterFlags, but the protoflow UI has a bug with fields that have messages (the input loses focus when you click on it)
func Process(model whisper2.Model, path string, flags *gen.TranscriptionRequest) (rxgo.Observable, error) {
	var data []float32

	// Create processing context
	context, err := model.NewContext()
	if err != nil {
		return nil, err
	}

	// Set the parameters
	if err := SetParams(flags, context); err != nil {
		return nil, err
	}

	// Open the file
	fh, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer fh.Close()

	// Decode the WAV file - load the full buffer
	dec := wav.NewDecoder(fh)
	if buf, err := dec.FullPCMBuffer(); err != nil {
		return nil, err
	} else if dec.SampleRate != whisper2.SampleRate {
		return nil, fmt.Errorf("unsupported sample rate: %d", dec.SampleRate)
	} else if dec.NumChans != 1 {
		return nil, fmt.Errorf("unsupported number of channels: %d", dec.NumChans)
	} else {
		data = buf.AsFloat32Buffer().Data
	}

	// Segment callback when -tokens is specified
	segmentCh := make(chan rxgo.Item)
	rxgo.FromChannel(segmentCh)

	cb := func(segment whisper2.Segment) {
		var tokens []*gen.Token
		for _, token := range segment.Tokens {
			log.Debug().Str("token", token.Text).Msg("token")
			tokens = append(tokens, &gen.Token{
				Id:        uint32(token.Id),
				StartTime: uint64(token.Start),
				EndTime:   uint64(token.End),
				Text:      token.Text,
			})
		}
		segmentCh <- rxgo.Of(&gen.Segment{
			Num:    uint32(segment.Num),
			Text:   segment.Text,
			Tokens: tokens,
		})
	}

	// Process the data
	context.ResetTimings()
	context.SetTokenTimestamps(true)
	go func() {
		if err := context.Process(data, cb, nil); err != nil {
			log.Error().Err(err).Msg("error processing audio")
		}
		for {
			_, err := context.NextSegment()
			if err == io.EOF {
				break
			} else if err != nil {
				log.Error().Err(err).Msg("error processing audio")
			}
			//cb(seg)
		}
		close(segmentCh)
	}()

	//context.PrintTimings()
	return rxgo.FromChannel(segmentCh), nil
}

// Output text as SRT file
func OutputSRT(w io.Writer, context whisper2.Context) error {
	n := 1
	for {
		segment, err := context.NextSegment()
		if err == io.EOF {
			return nil
		} else if err != nil {
			return err
		}
		fmt.Fprintln(w, n)
		fmt.Fprintln(w, srtTimestamp(segment.Start), " --> ", srtTimestamp(segment.End))
		fmt.Fprintln(w, segment.Text)
		fmt.Fprintln(w, "")
		n++
	}
}

// Output text to terminal
func Output(w io.Writer, context whisper2.Context) error {
	for {
		segment, err := context.NextSegment()
		if err == io.EOF {
			return nil
		} else if err != nil {
			return err
		}
		fmt.Fprintf(w, "[%6s->%6s]", segment.Start.Truncate(time.Millisecond), segment.End.Truncate(time.Millisecond))
		fmt.Fprintln(w, " ", segment.Text)
	}
}

// Return srtTimestamp
func srtTimestamp(t time.Duration) string {
	return fmt.Sprintf("%02d:%02d:%02d,%03d", t/time.Hour, (t%time.Hour)/time.Minute, (t%time.Minute)/time.Second, (t%time.Second)/time.Millisecond)
}
