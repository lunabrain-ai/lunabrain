package normalize

import (
	"context"
	"github.com/google/wire"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/lunabrain-ai/lunabrain/gen/python"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize/types"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/scrape"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/lunabrain-ai/lunabrain/pkg/util"
	"github.com/pkg/errors"
)

// Normalizer is an interface for normalizing data into text.
type Normalizer interface {
	NormalizeText(data string) (content []*types.Content, err error)
	NormalizeURL(url string, crawl bool) (content []*types.Content, err error)
	NormalizeFile(file, contentType string) (content []*types.Content, err error)
}

type normalizer struct {
	audio  *AudioNormalizer
	url    *URLNormalizer
	python python.PythonClient
	db     db.Store
}

var ProviderSet = wire.NewSet(
	scrape.ProviderSet,
	NewConfig,
	NewNormalizer,
	NewAudioNormalizer,
	NewURLNormalizer,
	wire.Bind(new(Normalizer), new(*normalizer)),
)

func (n *normalizer) NormalizeText(data string) (content []*types.Content, err error) {
	text, err := n.python.Normalize(context.Background(), &python.Text{
		Text: data,
	})
	if err != nil {
		return nil, errors.Wrapf(err, "unable to normalize text %s", data)
	}

	return []*types.Content{
		{
			NormalizerID: genapi.NormalizerID_TEXT_CLEAN,
			Data:         text.Text,
		},
	}, nil
}

func (n *normalizer) NormalizeURL(url string, crawl bool) (content []*types.Content, err error) {
	return n.url.Normalize(url, crawl)
}

func (n *normalizer) NormalizeFile(file, contentType string) (content []*types.Content, err error) {
	if contentType == "" {
		var err error
		contentType, err = util.DetectFileType(file)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to detect file type for %s", file)
		}
	}

	if contentType == "audio" {
		return n.audio.Normalize(file)
	}
	return nil, errors.Errorf("unable to normalize file %s with content type %s", file, contentType)
}

// NewNormalizer creates a new normalizer.
func NewNormalizer(
	audio *AudioNormalizer,
	url *URLNormalizer,
	db db.Store,
	p python.PythonClient,
) (*normalizer, error) {
	return &normalizer{
		python: p,
		db:     db,
		audio:  audio,
		url:    url,
	}, nil
}
