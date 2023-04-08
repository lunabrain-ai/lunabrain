package util

import (
	"github.com/lunabrain-ai/lunabrain/pkg/store/db/model"
)

func GenerateTranscript(msgs []*model.DiscordMessage) string {
	var transcript string
	for _, msg := range msgs {
		transcript += msg.AuthorUsername + ": " + msg.Content + "\n"
	}
	return transcript
}
