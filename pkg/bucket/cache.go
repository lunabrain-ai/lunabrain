package bucket

import (
	"github.com/pkg/errors"
	"os"
	"os/user"
	"path"
)

func EnsureDirExists(p string) error {
	if _, err := os.Stat(p); os.IsNotExist(err) {
		if err := os.MkdirAll(p, 0700); err != nil {
			return errors.Wrapf(err, "could not create folder: %v", p)
		}
	}
	return nil
}

func CreateLocalDir(dirName string) (string, error) {
	// Get the current user
	u, err := user.Current()
	if err != nil {
		return "", errors.Wrapf(err, "could not get current user")
	}

	p := path.Join(u.HomeDir, dirName)
	return p, EnsureDirExists(p)
}
