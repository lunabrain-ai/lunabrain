package util

import (
	"github.com/pkg/errors"
	"net/url"
	"os"
	"path/filepath"
)

func SaveURLToFolder(dir string, u *url.URL, body []byte) error {
	// Extract the host name from the URL
	host := u.Hostname()

	// Create a folder with the host name if it doesn't exist
	folderPath := filepath.Join(dir, host, u.Path)
	err := os.MkdirAll(folderPath, os.ModePerm)
	if err != nil && !os.IsExist(err) {
		return errors.Wrapf(err, "failed to create folder for URL %s", u.String())
	}

	filename := filepath.Base(u.Path)
	if filename == "" || filename == "." {
		filename = "index.html"
	}

	ext := filepath.Ext(filename)
	if ext == "" {
		filename += ".html"
	}

	// Write the body to a file in the folder with the URL path as the filename
	filePath := filepath.Join(folderPath, filename)
	err = os.WriteFile(filePath, body, os.ModePerm)
	if err != nil && !os.IsExist(err) {
		return errors.Wrapf(err, "failed to save URL %s to file %s", u.String(), filePath)
	}

	return nil
}
