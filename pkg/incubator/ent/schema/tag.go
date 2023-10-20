package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
)

// Tag holds the schema definition for the Tag entity.
type Tag struct {
	ent.Schema
}

// Fields of the Tag.
func (Tag) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New).
			StorageKey("oid"),
		field.String("name").
			Unique(),
	}
}

// Edges of the Tag.
func (Tag) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("group", Group.Type).
			Ref("tags").
			Unique(),
		edge.To("contents", Content.Type),
	}
}
