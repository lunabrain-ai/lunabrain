package publish

import (
	"github.com/bwmarrin/discordgo"
	"github.com/google/uuid"
	genapi "github.com/lunabrain-ai/lunabrain/gen"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db/model"
	"github.com/pkg/errors"
	"github.com/rs/zerolog/log"
)

type FileConfig struct {
	Enabled bool `yaml:"enabled"`

	Type string `yaml:"type"`
}

type File struct {
	session *discordgo.Session
	config  FileConfig
	db      db.Store
}

func formatForFile(content *model.Content) string {
	// TODO breadchris for message summaries, this will be too much data
	formatted := "" // "Data: " + content.Data + "\n"
	for _, normalContent := range content.NormalizedContent {
		for _, transformedContent := range normalContent.TransformedContent {
			if transformedContent.TransformerID == int32(genapi.TransformerID_SUMMARY) {
				formatted += "Summary: " + transformedContent.Data + "\n"
			}
			if transformedContent.TransformerID == int32(genapi.TransformerID_CATEGORIES) {
				formatted += "Categories: " + transformedContent.Data + "\n"
			}
		}
	}
	return formatted
}

func (f *File) Publish(contentID uuid.UUID) error {
	if !f.config.Enabled {
		log.Debug().
			Str("contentID", contentID.String()).
			Msg("content publishing to file disabled")
		return nil
	}

	log.Debug().
		Str("contentID", contentID.String()).
		Msg("publishing content to file")

	content, err := f.db.GetContentByID(contentID)
	if err != nil {
		return errors.Wrapf(err, "failed to get content by id %s", contentID)
	}

	// TODO breadchris this is a POC for publishing to a file
	if f.config.Type == "logseq" {
		msg := formatForFile(content)
		log.Debug().Str("msg", msg).Msg("publishing to file")
	}
	return nil
}

func NewFile(config Config, db db.Store) *File {
	return &File{
		config: config.File,
		db:     db,
	}
}
