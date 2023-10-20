package bot

import (
	"context"
	"github.com/alexferrari88/gohn/pkg/gohn"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/gen/content"
	cnt "github.com/lunabrain-ai/lunabrain/pkg/content"
	"github.com/lunabrain-ai/lunabrain/pkg/db"
	"github.com/lunabrain-ai/lunabrain/pkg/db/model"
	"github.com/pkg/errors"
	"gorm.io/datatypes"
	"log/slog"
)

// HN collects messages from Hacker News
type HN struct {
	db         *db.Store
	normalizer *cnt.Normalize
}

type HNStory struct {
	model.Base

	Data datatypes.JSONType[*gohn.Story]
}

func NewHN(
	db *db.Store,
	normalizer *cnt.Normalize,
) *HN {
	return &HN{
		db:         db,
		normalizer: normalizer,
	}
}

func (c *HN) Collect(userID string) error {
	hn := gohn.NewClient(nil)

	ctx := context.Background()
	topStoriesIds, err := hn.Stories.GetTopIDs(ctx)
	if err != nil {
		return err
	}

	frontPageStories := topStoriesIds[:5]

	id, err := c.db.UpsertBot("hn")
	if err != nil {
		return err
	}

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
		_, _, err = c.db.SaveHNStory(*story.ID, *story.URL, &i, uuid.New(), story, comments)
		if err != nil {
			slog.Warn("error storing hn story", "error", err)
			continue
		}

		//if existing {
		//	// TODO breadchris SaveContent is currently not fully idempotent
		//	// do not save new content
		//	continue
		//}

		data := &content.Content{
			Tags: []string{"news.ycombinator.com"},
			Type: &content.Content_Data{
				Data: &content.Data{
					Type: &content.Data_Url{
						Url: &content.URL{
							Url: *story.URL,
						},
					},
				},
			},
		}

		norm, err := c.normalizer.Normalize(data)
		if err != nil {
			return errors.Wrapf(err, "unable to normalize content")
		}

		// TODO breadchris remove user
		_, err = c.db.SaveContent(uuid.MustParse(userID), id, data, norm)
		if err != nil {
			slog.Warn("error storing content", "error", err)
			continue
		}
	}
	return nil
}
