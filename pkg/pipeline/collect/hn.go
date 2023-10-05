package collect

import (
	"context"
	"github.com/alexferrari88/gohn/pkg/gohn"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/pkg/db"
	"github.com/lunabrain-ai/lunabrain/pkg/db/model"
	"github.com/rs/zerolog/log"
	"gorm.io/datatypes"
)

// HNCollect collects messages from Hacker News
type HNCollect struct {
	db *db.Store
}

type HNStory struct {
	model.Base

	Data datatypes.JSONType[*gohn.Story]
}

func (c *HNCollect) Collect() error {
	hn := gohn.NewClient(nil)

	ctx := context.Background()
	topStoriesIds, err := hn.Stories.GetTopIDs(ctx)
	if err != nil {
		return err
	}

	frontPageStories := topStoriesIds[:5]

	for i, storyID := range frontPageStories {
		story, _ := hn.Items.Get(ctx, *storyID)
		if story.URL == nil {
			// TODO breadchris this only supports stories that have urls right now
			// there are different types of stories
			continue
		}

		comments, err := hn.Items.FetchAllDescendants(ctx, story, nil)
		if err != nil {
			log.Warn().Err(err).Msg("error fetching hn comments")
			continue
		}

		log.Info().Str("story", *story.URL).Msg("processing story")

		// TODO breadchris process story.URL
		if err != nil {
			log.Warn().Err(err).Msg("error processing content")
			continue
		}

		// TODO breadchris set the ID
		_, err = c.db.SaveHNStory(*story.ID, *story.URL, &i, uuid.New(), story, comments)
		if err != nil {
			log.Warn().Err(err).Msg("error storing hn story")
			continue
		}
	}
	return nil
}

func NewHNCollector(
	db *db.Store,
) *HNCollect {
	return &HNCollect{
		db: db,
	}
}
