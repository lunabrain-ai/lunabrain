package source

import (
	"context"
	"github.com/alexferrari88/gohn/pkg/gohn"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/pkg/db"
	"github.com/lunabrain-ai/lunabrain/pkg/db/model"
	"gorm.io/datatypes"
	"log/slog"
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
			slog.Warn("error fetching hn comments", "error", err)
			continue
		}

		slog.Info("processing story", "story", *story.URL)

		// TODO breadchris process story.URL
		if err != nil {
			slog.Warn("error processing content", "error", err)
			continue
		}

		// TODO breadchris set the ID
		_, err = c.db.SaveHNStory(*story.ID, *story.URL, &i, uuid.New(), story, comments)
		if err != nil {
			slog.Warn("error storing hn story", "error", err)
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
