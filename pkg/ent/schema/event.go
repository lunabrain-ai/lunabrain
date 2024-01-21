package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/event"
	"time"
)

type Event struct {
	ent.Schema
}

func (Event) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.JSON("data", &event.Metric{}),
		field.Time("created_at").Default(time.Now),
	}
}
