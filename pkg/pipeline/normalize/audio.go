package normalize

import (
	"context"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/lunabrain-ai/lunabrain/gen/python"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize/content"
	"github.com/rs/zerolog/log"
)

type AudioNormalizer struct {
	client python.PythonClient
}

func (s *AudioNormalizer) Normalize(filepath string) ([]*content.Content, error) {
	log.Debug().Str("filepath", filepath).Msg("normalizing audio file")
	resp, err := s.client.Transcribe(context.Background(), &python.TranscribeRequest{
		File: filepath,
	})
	if err != nil {
		return nil, err
	}
	return []*content.Content{
		{
			NormalizerID: genapi.NormalizerID_AUDIO_TRANSCRIPT,
			Data:         resp.Transcription,
		},
	}, nil
}

func NewAudioNormalizer(client python.PythonClient) (*AudioNormalizer, error) {
	return &AudioNormalizer{
		client: client,
	}, nil
}
