package normalize

import (
	"context"
	"github.com/google/wire"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/lunabrain-ai/lunabrain/gen/python"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/normalize/content"
	"github.com/lunabrain-ai/lunabrain/pkg/scrape"
	"github.com/lunabrain-ai/lunabrain/pkg/store/bucket"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/pkg/errors"
	"net/http"
)

// Normalizer is an interface for normalizing data into text.
type Normalizer interface {
	NormalizeText(data string) (content []*content.Content, err error)
	NormalizeURL(url string, crawl bool) (content []*content.Content, err error)
	NormalizeFile(file, contentType string) (content []*content.Content, err error)
}

type normalizer struct {
	audio  *AudioNormalizer
	url    *URLNormalizer
	python python.PythonClient
	db     db.Store
	bucket *bucket.Bucket
}

var ProviderSet = wire.NewSet(
	scrape.ProviderSet,
	NewConfig,
	NewNormalizer,
	NewAudioNormalizer,
	NewURLNormalizer,
	wire.Bind(new(Normalizer), new(*normalizer)),
)

func (n *normalizer) NormalizeText(data string) ([]*content.Content, error) {
	text, err := n.python.Normalize(context.Background(), &python.Text{
		Text: data,
	})
	if err != nil {
		return nil, errors.Wrapf(err, "unable to normalize text %s", data)
	}

	return []*content.Content{
		{
			NormalizerID: genapi.NormalizerID_TEXT_CLEAN,
			Data:         text.Text,
		},
	}, nil
}

func (n *normalizer) NormalizeURL(url string, crawl bool) (content []*content.Content, err error) {
	return n.url.Normalize(url, crawl)
}

func (n *normalizer) NormalizeFile(file, contentType string) (content []*content.Content, err error) {
	if contentType == "" {
		fileContent, err := n.bucket.ReadAll(context.Background(), file)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to read file %s", file)
		}
		contentType = http.DetectContentType(fileContent)
	}

	if contentType == "audio" {
		filepath, err := n.bucket.NewFile(file)
		if err != nil {
			return nil, errors.Wrapf(err, "unable to create new file %s", file)
		}
		return n.audio.Normalize(filepath)
	}
	return nil, errors.Errorf("unable to normalize file %s with content type %s", file, contentType)
}

// NewNormalizer creates a new normalizer.
func NewNormalizer(
	audio *AudioNormalizer,
	url *URLNormalizer,
	db db.Store,
	p python.PythonClient,
	bucket *bucket.Bucket,
) (*normalizer, error) {
	return &normalizer{
		python: p,
		db:     db,
		audio:  audio,
		url:    url,
		bucket: bucket,
	}, nil
}
