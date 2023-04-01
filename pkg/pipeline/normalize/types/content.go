package types

import genapi "github.com/lunabrain-ai/lunabrain/gen/api"

type NormalizedContent struct {
	NormalizerID genapi.NormalizerID
	Data         string
}
