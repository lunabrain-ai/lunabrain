package content

import genapi "github.com/lunabrain-ai/lunabrain/gen"

type Content struct {
	TransformerID genapi.TransformerID
	Data          string

	// TODO breadchris add metadata
}
