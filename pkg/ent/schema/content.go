package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/content"
	"google.golang.org/protobuf/encoding/protojson"
	"time"
)

// Content holds the schema definition for the Content entity.
type Content struct {
	ent.Schema
}

// Fields of the Content.
func (Content) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.Bool("root"),
		field.JSON("data", &ContentEncoder{}),
		field.Time("created_at").Default(time.Now),
		field.Time("updated_at").
			Optional().
			Default(time.Now).
			UpdateDefault(time.Now),
	}
}

// Edges of the Content.
func (Content) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Ref("content").
			Unique(),
		edge.From("tags", Tag.Type).
			Ref("contents"),
		edge.To("children", Content.Type),
		edge.From("parents", Content.Type).
			Ref("children"),
		edge.To("groups", Group.Type),
	}
}

// ContentEncoder give a generic data type for json encoded data.
type ContentEncoder struct {
	// TODO breadchris couldn't figure out how to make this generic, there is a problem with protojson.Unmarshal/Marshal
	*content.Content
}

func (c *ContentEncoder) MarshalJSON() ([]byte, error) {
	marshaler := &protojson.MarshalOptions{}
	b, err := marshaler.Marshal(c.Content)
	if err != nil {
		return nil, err
	}
	return b, nil
}

func (c *ContentEncoder) UnmarshalJSON(data []byte) error {
	unmarshaler := protojson.UnmarshalOptions{DiscardUnknown: true}

	if c.Content == nil {
		c.Content = &content.Content{}
	}

	if err := unmarshaler.Unmarshal(data, c.Content); err != nil {
		return err
	}
	return nil
}
