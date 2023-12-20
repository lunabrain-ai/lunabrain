package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/field"
)

type Session struct {
	ent.Schema
}

func (Session) Fields() []ent.Field {
	return []ent.Field{
		field.String("token").Unique(),
		field.Bytes("data"),
		field.Time("expiry"),
	}
}

func (Session) Edges() []ent.Edge {
	return nil
}
