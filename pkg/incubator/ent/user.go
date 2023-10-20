// Code generated by ent, DO NOT EDIT.

package ent

import (
	"encoding/json"
	"fmt"
	"strings"

	"entgo.io/ent"
	"entgo.io/ent/dialect/sql"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/gen/user"
	entuser "github.com/lunabrain-ai/lunabrain/pkg/incubator/ent/user"
)

// User is the model entity for the User schema.
type User struct {
	config `json:"-"`
	// ID of the ent.
	ID uuid.UUID `json:"id,omitempty"`
	// PasswordHash holds the value of the "password_hash" field.
	PasswordHash string `json:"password_hash,omitempty"`
	// Data holds the value of the "data" field.
	Data user.User `json:"data,omitempty"`
	// Edges holds the relations/edges for other nodes in the graph.
	// The values are being populated by the UserQuery when eager-loading is set.
	Edges        UserEdges `json:"edges"`
	selectValues sql.SelectValues
}

// UserEdges holds the relations/edges for other nodes in the graph.
type UserEdges struct {
	// Content holds the value of the content edge.
	Content []*Content `json:"content,omitempty"`
	// GroupUsers holds the value of the group_users edge.
	GroupUsers []*GroupUser `json:"group_users,omitempty"`
	// Votes holds the value of the votes edge.
	Votes []*Vote `json:"votes,omitempty"`
	// loadedTypes holds the information for reporting if a
	// type was loaded (or requested) in eager-loading or not.
	loadedTypes [3]bool
}

// ContentOrErr returns the Content value or an error if the edge
// was not loaded in eager-loading.
func (e UserEdges) ContentOrErr() ([]*Content, error) {
	if e.loadedTypes[0] {
		return e.Content, nil
	}
	return nil, &NotLoadedError{edge: "content"}
}

// GroupUsersOrErr returns the GroupUsers value or an error if the edge
// was not loaded in eager-loading.
func (e UserEdges) GroupUsersOrErr() ([]*GroupUser, error) {
	if e.loadedTypes[1] {
		return e.GroupUsers, nil
	}
	return nil, &NotLoadedError{edge: "group_users"}
}

// VotesOrErr returns the Votes value or an error if the edge
// was not loaded in eager-loading.
func (e UserEdges) VotesOrErr() ([]*Vote, error) {
	if e.loadedTypes[2] {
		return e.Votes, nil
	}
	return nil, &NotLoadedError{edge: "votes"}
}

// scanValues returns the types for scanning values from sql.Rows.
func (*User) scanValues(columns []string) ([]any, error) {
	values := make([]any, len(columns))
	for i := range columns {
		switch columns[i] {
		case entuser.FieldData:
			values[i] = new([]byte)
		case entuser.FieldPasswordHash:
			values[i] = new(sql.NullString)
		case entuser.FieldID:
			values[i] = new(uuid.UUID)
		default:
			values[i] = new(sql.UnknownType)
		}
	}
	return values, nil
}

// assignValues assigns the values that were returned from sql.Rows (after scanning)
// to the User fields.
func (u *User) assignValues(columns []string, values []any) error {
	if m, n := len(values), len(columns); m < n {
		return fmt.Errorf("mismatch number of scan values: %d != %d", m, n)
	}
	for i := range columns {
		switch columns[i] {
		case entuser.FieldID:
			if value, ok := values[i].(*uuid.UUID); !ok {
				return fmt.Errorf("unexpected type %T for field id", values[i])
			} else if value != nil {
				u.ID = *value
			}
		case entuser.FieldPasswordHash:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field password_hash", values[i])
			} else if value.Valid {
				u.PasswordHash = value.String
			}
		case entuser.FieldData:
			if value, ok := values[i].(*[]byte); !ok {
				return fmt.Errorf("unexpected type %T for field data", values[i])
			} else if value != nil && len(*value) > 0 {
				if err := json.Unmarshal(*value, &u.Data); err != nil {
					return fmt.Errorf("unmarshal field data: %w", err)
				}
			}
		default:
			u.selectValues.Set(columns[i], values[i])
		}
	}
	return nil
}

// Value returns the ent.Value that was dynamically selected and assigned to the User.
// This includes values selected through modifiers, order, etc.
func (u *User) Value(name string) (ent.Value, error) {
	return u.selectValues.Get(name)
}

// QueryContent queries the "content" edge of the User entity.
func (u *User) QueryContent() *ContentQuery {
	return NewUserClient(u.config).QueryContent(u)
}

// QueryGroupUsers queries the "group_users" edge of the User entity.
func (u *User) QueryGroupUsers() *GroupUserQuery {
	return NewUserClient(u.config).QueryGroupUsers(u)
}

// QueryVotes queries the "votes" edge of the User entity.
func (u *User) QueryVotes() *VoteQuery {
	return NewUserClient(u.config).QueryVotes(u)
}

// Update returns a builder for updating this User.
// Note that you need to call User.Unwrap() before calling this method if this User
// was returned from a transaction, and the transaction was committed or rolled back.
func (u *User) Update() *UserUpdateOne {
	return NewUserClient(u.config).UpdateOne(u)
}

// Unwrap unwraps the User entity that was returned from a transaction after it was closed,
// so that all future queries will be executed through the driver which created the transaction.
func (u *User) Unwrap() *User {
	_tx, ok := u.config.driver.(*txDriver)
	if !ok {
		panic("ent: User is not a transactional entity")
	}
	u.config.driver = _tx.drv
	return u
}

// String implements the fmt.Stringer.
func (u *User) String() string {
	var builder strings.Builder
	builder.WriteString("User(")
	builder.WriteString(fmt.Sprintf("id=%v, ", u.ID))
	builder.WriteString("password_hash=")
	builder.WriteString(u.PasswordHash)
	builder.WriteString(", ")
	builder.WriteString("data=")
	builder.WriteString(fmt.Sprintf("%v", u.Data))
	builder.WriteByte(')')
	return builder.String()
}

// Users is a parsable slice of User.
type Users []*User
