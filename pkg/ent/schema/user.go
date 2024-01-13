package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/user"
	"google.golang.org/protobuf/encoding/protojson"
)

// User holds the schema definition for the User entity.
type User struct {
	ent.Schema
}

// Fields of the User.
func (User) Fields() []ent.Field {
	return []ent.Field{
		field.UUID("id", uuid.UUID{}).
			Default(uuid.New),
		field.String("email"),
		field.String("password_hash"),
		field.JSON("data", UserEncoder{}),
		field.Bool("verified").Default(false),
		field.UUID("verify_secret", uuid.UUID{}).Optional(),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("content", Content.Type),
		edge.To("group_users", GroupUser.Type),
	}
}

// UserEncoder give a generic data type for json encoded data.
type UserEncoder struct {
	// TODO breadchris couldn't figure out how to make this generic, there is a problem with protojson.Unmarshal/Marshal
	// https://entgo.io/docs/faq/#how-to-store-protobuf-objects-in-a-blob-column
	*user.User
}

func (c *UserEncoder) MarshalJSON() ([]byte, error) {
	marshaler := &protojson.MarshalOptions{}
	b, err := marshaler.Marshal(c.User)
	if err != nil {
		return nil, err
	}
	return b, nil
}

func (c *UserEncoder) UnmarshalJSON(data []byte) error {
	unmarshaler := protojson.UnmarshalOptions{DiscardUnknown: true}

	if c.User == nil {
		c.User = &user.User{}
	}

	if err := unmarshaler.Unmarshal(data, c.User); err != nil {
		return err
	}
	return nil
}
