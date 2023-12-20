package publish

import (
	"github.com/bwmarrin/discordgo"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/pkg/db"
	"log/slog"
)

type FileConfig struct {
	Enabled bool `yaml:"enabled"`

	Type string `yaml:"type"`
}

type File struct {
	session *discordgo.Session
	config  FileConfig
	db      db.GormStore
}

func (f *File) Publish(contentID uuid.UUID) error {
	if !f.config.Enabled {
		slog.Debug("content publishing to file disabled", "contentID", contentID.String())
		return nil
	}

	slog.Debug("publishing content to file", "contentID", contentID.String())

	//_, err := f.db.GetContentByID(contentID)
	//if err != nil {
	//	return errors.Wrapf(err, "failed to get content by id %s", contentID)
	//}
	//
	//// TODO breadchris this is a POC for publishing to a file
	//if f.config.Type == "logseq" {
	//	slog.Info("publishing to logseq")
	//}
	return nil
}

func NewFile(config Config, db db.GormStore) *File {
	return &File{
		config: config.File,
		db:     db,
	}
}
