package util

import (
	"github.com/justshare-io/justshare/pkg/db/model"
)

func GenerateTranscript(msgs []*model.DiscordMessage) string {
	var transcript string
	for _, msg := range msgs {
		transcript += msg.AuthorUsername + ": " + msg.Content + "\n"
	}
	return transcript
}
