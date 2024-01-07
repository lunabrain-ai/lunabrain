package util

import (
	"context"
	"github.com/reactivex/rxgo/v2"
	"io"
	"io/fs"
	"os"
	"path/filepath"
)

func RemoveAllFilesInDir(dir string) error {
	return filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		// Skip the root directory itself
		if path == dir {
			return nil
		}
		if !info.IsDir() {
			// Remove the file
			return os.Remove(path)
		}
		return nil
	})
}

func CopyFile(src fs.File, dst string) error {
	df, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer df.Close()

	_, err = io.Copy(df, src)
	return err
}

func CopyDir(fsys fs.FS, src string, dst string) error {
	return fs.WalkDir(fsys, src, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		targetPath := filepath.Join(dst, path)
		if d.IsDir() {
			return os.MkdirAll(targetPath, os.ModePerm)
		}

		srcFile, err := fsys.Open(path)
		if err != nil {
			return err
		}
		defer srcFile.Close()

		return CopyFile(srcFile, targetPath)
	})
}

// WalkDirectory walks a directory and emits file paths to an Observable.
func WalkDirectory(dir, ext string) rxgo.Observable {
	return rxgo.Create([]rxgo.Producer{func(ctx context.Context, next chan<- rxgo.Item) {
		_ = filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
			if err != nil {
				return err
			}
			if !info.IsDir() && filepath.Ext(path) == ext {
				next <- rxgo.Of(path)
			}
			return nil
		})
	}})
}
