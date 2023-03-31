package collect

import (
	"context"
	"github.com/alexferrari88/gohn/pkg/gohn"
	"github.com/bwmarrin/discordgo"
	genapi "github.com/lunabrain-ai/lunabrain/gen/api"
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline"
	"github.com/lunabrain-ai/lunabrain/pkg/store/db"
	"github.com/rs/zerolog/log"
)

// HNCollector collects messages from Hacker News
type HNCollector struct {
	session  *discordgo.Session
	db       db.Store
	workflow pipeline.Workflow
}

func (c *HNCollector) Collect() error {
	hn := gohn.NewClient(nil)

	ctx := context.Background()
	topStoriesIds, _ := hn.Stories.GetTopIDs(ctx)

	for _, storyID := range topStoriesIds {
		story, _ := hn.Items.Get(ctx, *storyID)
		if story.URL == nil {
			// TODO breadchris this only supports stories that have urls right now
			// there are different types of stories
			continue
		}

		id, err := c.workflow.ProcessContent(ctx, &genapi.Content{
			Data:      []byte(*story.URL),
			Type:      genapi.ContentType_URL,
			Options:   nil,
			Metadata:  nil,
			CreatedAt: "",
			Id:        "",
		})
		if err != nil {
			log.Warn().Err(err).Msg("error processing content")
			continue
		}

		_, err = c.db.StoreHNStory(*story.ID, *story.URL, id)
		if err != nil {
			log.Warn().Err(err).Msg("error storing hn story")
			continue
		}
	}

	return nil
}

func NewHNCollector(session *discordgo.Session, db db.Store, workflow pipeline.Workflow) *HNCollector {
	return &HNCollector{
		session:  session,
		db:       db,
		workflow: workflow,
	}
}
