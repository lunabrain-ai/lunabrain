package normalize

import (
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/scrape"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/lunabrain-ai/lunabrain/pkg/util"
	"github.com/google/wire"
	"github.com/pkg/errors"
)

// Normalizer is an interface for normalizing data into text.
type Normalizer interface {
	NormalizeText(data string) (normalized string, err error)
	NormalizeURL(url string) (normalized, page string, err error)
	NormalizeFile(file, contentType string) (normalized string, err error)
}

type normalizer struct {
	audio *AudioNormalizer
	url   *URLNormalizer
	db    db.Store
}

var ProviderSet = wire.NewSet(
	scrape.ProviderSet,
	NewNormalizer,
	NewAudioNormalizer,
	NewURLNormalizer,
	wire.Bind(new(Normalizer), new(*normalizer)),
)

func (n *normalizer) NormalizeText(data string) (normalized string, err error) {
	return data, nil
}

func (n *normalizer) NormalizeURL(url string) (normalized, page string, err error) {
	// TODO breadchris use langchain to cleanup content
	return n.url.Normalize(url)
}

func (n *normalizer) NormalizeFile(file, contentType string) (normalized string, err error) {
	if contentType == "" {
		var err error
		contentType, err = util.DetectFileType(file)
		if err != nil {
			return "", errors.Wrapf(err, "unable to detect file type for %s", file)
		}
	}

	if contentType == "audio" {
		return n.audio.Normalize(file)
	}
	return "", errors.Errorf("unable to normalize file %s with content type %s", file, contentType)
}

// NewNormalizer creates a new normalizer.
func NewNormalizer(audio *AudioNormalizer, url *URLNormalizer, db db.Store) (*normalizer, error) {
	return &normalizer{
		db:    db,
		audio: audio,
		url:   url,
	}, nil
}
