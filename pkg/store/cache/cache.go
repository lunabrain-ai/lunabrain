package cache

import (
	"github.com/google/wire"
	"github.com/pkg/errors"
	"os"
	"os/user"
	"path"
)

type Cache interface {
	GetFile(name string) (string, error)
	GetFolder(name string) (string, error)
}

type LocalCache struct {
	dir string
}

var ProviderSet = wire.NewSet(
	NewConfig,
	NewLocalCache,
	wire.Bind(new(Cache), new(*LocalCache)),
)

func (c *LocalCache) GetFile(name string) (string, error) {
	return path.Join(c.dir, name), nil
}

func (c *LocalCache) GetFolder(name string) (string, error) {
	p := path.Join(c.dir, name)
	return p, ensureDirExists(p, name)
}

func ensureDirExists(p, dirName string) error {
	if _, err := os.Stat(p); os.IsNotExist(err) {
		if err := os.MkdirAll(p, 0700); err != nil {
			return errors.Wrapf(err, "could not create folder: %v", dirName)
		}
	}
	return nil
}

func createLocalDir(dirName string) (string, error) {
	// Get the current user
	u, err := user.Current()
	if err != nil {
		return "", errors.Wrapf(err, "could not get current user")
	}

	p := path.Join(u.HomeDir, "/", dirName)
	return p, ensureDirExists(p, dirName)
}

func NewLocalCache(c Config) (*LocalCache, error) {
	folder, err := createLocalDir(c.Name)
	if err != nil {
		return nil, err
	}

	return &LocalCache{
		dir: folder,
	}, nil
}
