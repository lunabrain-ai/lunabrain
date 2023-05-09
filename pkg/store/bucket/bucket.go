package bucket

import (
	"github.com/google/wire"
	"github.com/pkg/errors"
	"gocloud.dev/blob"
	"gocloud.dev/blob/fileblob"
	_ "gocloud.dev/blob/fileblob"
	"net/http"
	"net/url"
	"path"
)

type Bucket struct {
	*blob.Bucket
	config    Config
	URLSigner fileblob.URLSigner
}

var (
	ProviderSet = wire.NewSet(
		NewConfig,
		New,
		// TODO breadchris bind Bucket to interface so pointers are not passed around
	)
)

func (b *Bucket) NewFile(name string) (string, error) {
	return path.Join(b.config.Path, name), nil
}

func (b *Bucket) NewDir(name string) (string, error) {
	p := path.Join(b.config.Path, name)
	return p, EnsureDirExists(p)
}

func (b *Bucket) HandleSignedURLs() (string, http.Handler) {
	return b.config.URLBase, b
}

func New(config Config) (*Bucket, error) {
	var (
		err error
	)
	if config.Path == "" {
		config.Path, err = CreateLocalDir(config.LocalName)
		if err != nil {
			return nil, errors.Wrapf(err, "could not create local directory: %v", config.LocalName)
		}
		err = EnsureDirExists(path.Join(config.Path, "bucket"))
		if err != nil {
			return nil, errors.Wrapf(err, "could not make paths for local directory: %v", config.LocalName)
		}
	}

	baseURL, err := url.Parse(config.URLBase)
	if err != nil {
		return nil, errors.Wrapf(err, "could not parse url: %v", "/")
	}
	urlSigner := fileblob.NewURLSignerHMAC(baseURL, []byte("secret-key"))
	bucket, err := fileblob.OpenBucket(config.Path, &fileblob.Options{
		URLSigner: urlSigner,
		CreateDir: true,
	})

	// TODO breadchris support other bucket types
	//ctx := context.Background()
	//bucket, err := blob.OpenBucket(ctx, "file://"+config.Path)
	//if err != nil {
	//	return nil, errors.Wrapf(err, "could not open bucket: %v", config.Path)
	//}

	return &Bucket{
		Bucket:    bucket,
		config:    config,
		URLSigner: urlSigner,
	}, nil
}
