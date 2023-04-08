package model

import "time"

type DiscordChannel struct {
	BaseWithoutID

	ChannelID          string `gorm:"type:uuid;primary_key;"`
	DiscordTranscripts []DiscordTranscript
	Messages           []DiscordMessage
}

type DiscordMessage struct {
	BaseWithoutID

	MessageID        string `gorm:"type:uuid;primary_key;"`
	AuthorUsername   string
	AuthorID         string
	DiscordChannelID string
	DiscordChannel   DiscordChannel
	Timestamp        time.Time
	Content          string
}

type DiscordTranscript struct {
	Base

	DiscordChannelID string
	DiscordChannel   DiscordChannel
	Transcript       string
	StartMessageID   string
	EndMessageID     string
}
