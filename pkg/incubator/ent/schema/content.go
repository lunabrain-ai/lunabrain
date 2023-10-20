package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

// Content holds the schema definition for the Content entity.
type Content struct {
	ent.Schema
}

// Fields of the Content.
func (Content) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New).
			StorageKey("oid"),
		field.Bool("root"),
		field.Int64("visit_count"),
		field.JSON("data", ContentEncoder{}),
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
		edge.To("votes", Vote.Type),
		edge.To("groups", Group.Type),
	}
}
