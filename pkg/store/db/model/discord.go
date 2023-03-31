package model

type DiscordChannel struct {
	BaseWithoutID

	ChannelID          string `gorm:"type:uuid;primary_key;"`
	DiscordTranscripts []DiscordTranscript
}

type DiscordTranscript struct {
	Base

	DiscordChannelID string
	DiscordChannel   DiscordChannel
	Transcript       string
	StartMessageID   string
	EndMessageID     string
}
