package whisper

import (
	"github.com/lunabrain-ai/lunabrain/pkg/store/bucket"
	"testing"
)

func TestWAVAudioSplit(t *testing.T) {
	fileStore, err := bucket.New(bucket.Config{
		Path: "/tmp/lunabrain",
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
	fileStore, err := bucket.New(bucket.Config{
		Path: "/tmp/lunabrain",
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
