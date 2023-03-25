package store

import (
	"github.com/pkg/errors"
	"os"
	"os/user"
	"path"
)

const name = ".lunabrain"

type Cache interface {
	GetFile(name string) (string, error)
	GetFolder(name string) (string, error)
}

type FolderCache struct {
	dir string
}

func (c *FolderCache) GetFile(name string) (string, error) {
	return path.Join(c.dir, name), nil
}

func (c *FolderCache) GetFolder(name string) (string, error) {
	p := path.Join(c.dir, name)
	return p, ensureDirExists(p)
}

func ensureDirExists(p string) error {
	if _, err := os.Stat(p); os.IsNotExist(err) {
		if err := os.Mkdir(p, 0700); err != nil {
			return errors.Wrapf(err, "could not create folder: %v", name)
		}
	}
	return nil
}

func createLocalDir() (string, error) {
	// Get the current user
	u, err := user.Current()
	if err != nil {
		return "", errors.Wrapf(err, "could not get current user")
	}

	p := path.Join(u.HomeDir, "/", name)
	return p, ensureDirExists(p)
}

func NewFolderCache() (*FolderCache, error) {
	folder, err := createLocalDir()
	if err != nil {
		return nil, err
	}

	return &FolderCache{
		dir: folder,
	}, nil
}
