package whisper

import (
	bucket2 "github.com/justshare-io/justshare/pkg/bucket"
	"testing"
)

func TestWAVAudioSplit(t *testing.T) {
	fileStore, err := bucket2.New(bucket2.Config{
		Path: "/tmp/justshare",
	})
	if err != nil {
		t.Fatal(err)
	}
	err = splitWAVFile(fileStore, "test", "test.wav", 25*1024*1024, func(chunkFilePath string) error {
		t.Log(chunkFilePath)
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
}

func TestMP3AudioSplit(t *testing.T) {
	fileStore, err := bucket2.New(bucket2.Config{
		Path: "/tmp/justshare",
	})
	if err != nil {
		t.Fatal(err)
	}
	err = splitMP3File(fileStore, "test", "test.mp3", 25*1024*1024, func(chunkFilePath string) error {
		t.Log(chunkFilePath)
		return nil
	})
	if err != nil {
		t.Fatal(err)
	}
}
