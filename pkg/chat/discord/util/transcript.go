package util

import "github.com/bwmarrin/discordgo"

func GenerateTranscript(msgs []*discordgo.Message) string {
	var transcript string
	for _, msg := range msgs {
		var author string
		if msg.Author != nil {
			author = msg.Author.Username
		}
		transcript += author + ": " + msg.Content + "\n"
	}
	return transcript
}
