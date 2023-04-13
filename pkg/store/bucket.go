package store

import (
	"context"
	"github.com/lunabrain-ai/lunabrain/pkg/store/cache"
	"github.com/pkg/errors"
	"gocloud.dev/blob"
	_ "gocloud.dev/blob/fileblob"
	"os"
	"path/filepath"
	"strings"
)

const dir = "bucket"

type Bucket struct {
	*blob.Bucket
	Location string
}

func NewLocalBucket(cache cache.Cache) (*Bucket, error) {
	folder, err := cache.GetFolder(dir)
	if err != nil {
		return nil, errors.Wrapf(err, "could not get file store folder: %v", dir)
	}

	// On Unix, append the dir to "file://".
	// On Windows, convert "\" to "/" and add a leading "/":
	dirpath := filepath.ToSlash(folder)
	if os.PathSeparator != '/' && !strings.HasPrefix(dirpath, "/") {
		dirpath = "/" + dirpath
	}

	ctx := context.Background()
	bucket, err := blob.OpenBucket(ctx, "file://"+dirpath)
	if err != nil {
		return nil, errors.Wrapf(err, "could not open bucket: %v", dirpath)
	}

	return &Bucket{
		Bucket:   bucket,
		Location: dirpath,
	}, nil
}
