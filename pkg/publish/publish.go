package publish

import (
	"github.com/google/uuid"
	"github.com/google/wire"
	"github.com/rs/zerolog/log"
)

var ProviderSet = wire.NewSet(
	NewConfig,
	NewDiscord,
	NewPublisher,
	wire.Bind(new(Publisher), new(*Publish)),
)

type Publisher interface {
	Publish(contentID uuid.UUID) error
}

type Publish struct {
	publishers []Publisher
}

// TODO breadchris should there be context here?
func (p *Publish) Publish(contentID uuid.UUID) error {
	for _, publisher := range p.publishers {
		log.Debug().
			Str("contentID", contentID.String()).
			Msg("publishing content")
		if err := publisher.Publish(contentID); err != nil {
			return err
		}
	}
	return nil
}

func NewPublisher(discord *Discord) *Publish {
	return &Publish{
		publishers: []Publisher{
			discord,
		},
	}
}
