package types

import genapi "github.com/lunabrain-ai/lunabrain/gen/api"

type Content struct {
	NormalizerID genapi.NormalizerID
	Data         string
}
