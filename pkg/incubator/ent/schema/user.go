package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/gen/user"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New).
			StorageKey("oid"),
		field.String("password_hash"),
		field.JSON("data", user.User{}),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("content", Content.Type),
		edge.To("group_users", GroupUser.Type),
		edge.To("votes", Vote.Type),
	}
}
