package normalize

import (
	"context"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/lunabrain-ai/lunabrain/gen/python"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize/types"
)

type AudioNormalizer struct {
	client python.PythonClient
}

func (s *AudioNormalizer) Normalize(fileName string) (content []*types.NormalizedContent, err error) {
	resp, err := s.client.Transcribe(context.Background(), &python.TranscribeRequest{
		File: fileName,
	})
	if err != nil {
		return
	}
	content = []*types.NormalizedContent{
		{
			NormalizerID: genapi.NormalizerID_AUDIO_TRANSCRIPT,
			Data:         resp.Transcription,
		},
	}
	return
}

func NewAudioNormalizer(client python.PythonClient) (*AudioNormalizer, error) {
	return &AudioNormalizer{
		client: client,
	}, nil
}
