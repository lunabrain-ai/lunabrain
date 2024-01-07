package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/user"
)

// Group holds the schema definition for the Group entity.
type Group struct {
	ent.Schema
}

// Fields of the Group.
func (Group) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.JSON("data", &user.Group{}),
	}
}

// Edges of the Group.
func (Group) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("group_users", GroupUser.Type),
		edge.To("invites", GroupInvite.Type),
		edge.From("content", Content.Type).
			Ref("groups"),
		edge.To("tags", Tag.Type),
	}
}

// GroupUser holds the schema definition for the GroupUser entity.
type GroupUser struct {
	ent.Schema
}

// Fields of the GroupUser.
func (GroupUser) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.String("role"),
	}
}

// Edges of the GroupUser.
func (GroupUser) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Ref("group_users").
			Unique(),
		edge.From("group", Group.Type).
			Ref("group_users").
			Unique(),
	}
}

// GroupInvite holds the schema definition for the GroupInvite entity.
type GroupInvite struct {
	ent.Schema
}

// Fields of the GroupInvite.
func (GroupInvite) Fields() []ent.Field {
	return []ent.Field{
		field.String("secret"),
	}
}

// Edges of the GroupInvite.
func (GroupInvite) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("group", Group.Type).
			Ref("invites").
			Unique(),
	}
}
