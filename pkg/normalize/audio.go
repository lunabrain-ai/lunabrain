package normalize

import (
	"context"
	"github.com/breadchris/sifty/backend/gen"
	"github.com/breadchris/sifty/backend/pkg/ml"
)

func Transcribe(fileName string) (transcript string, err error) {
	client, err := ml.NewPythonClient()
	if err != nil {
		return
	}

	resp, err := client.Transcribe(context.Background(), &gen.TranscribeRequest{
		File: fileName,
	})
	if err != nil {
		return
	}
	transcript = resp.Transcription
	return
}
