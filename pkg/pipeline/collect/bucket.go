package collect

import (
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"

	"github.com/fsnotify/fsnotify"
)

func listAACFiles(dir string) ([]string, error) {
	files, err := ioutil.ReadDir(dir)
	if err != nil {
		return nil, err
	}

	var aacFiles []string
	for _, file := range files {
		if !file.IsDir() {
			ext := filepath.Ext(file.Name())
			if ext == ".aac" {
				aacFiles = append(aacFiles, file.Name())
			}
		}
	}

	return aacFiles, nil
}

func listenForChangesToNotes(watchDir string) {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer watcher.Close()

	done := make(chan bool)

	go func() {
		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					return
				}
				fmt.Println(event.Name)
				if event.Op&fsnotify.Create == fsnotify.Create {
					ext := filepath.Ext(event.Name)
					if ext == ".aac" && filepath.Dir(event.Name) == "assets" {
						processAudio(event.Name)
					}
				}
			case err, ok := <-watcher.Errors:
				if !ok {
					return
				}
				fmt.Println("Error:", err)
			}
		}
	}()

	err = watcher.Add(watchDir)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}

	<-done
}

func processAudio(filename string) {
	fmt.Println("Processing audio:", filename)
	// do something with the audio file
}

func WatchForAudioFiles(notesDir string) error {
	dir := os.Args[1]

	files, err := listAACFiles(dir)
	if err != nil {
		return err
	}

	for _, file := range files {
		println("getting transcript for file", file)
	}
	return nil
}

// TODO breadchris a bucket collector will collect data that is located in directory or "bucket" since data can be remote or local
type BucketCollector struct {
}

func (c *BucketCollector) Collect() error {
	return nil
}

func NewBucketCollector() *BucketCollector {
	return &BucketCollector{}
}
