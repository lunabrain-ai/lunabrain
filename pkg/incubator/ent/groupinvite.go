// Code generated by ent, DO NOT EDIT.

package ent

import (
	"fmt"
	"strings"

	"entgo.io/ent"
	"entgo.io/ent/dialect/sql"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/pkg/incubator/ent/group"
	"github.com/lunabrain-ai/lunabrain/pkg/incubator/ent/groupinvite"
)

// GroupInvite is the model entity for the GroupInvite schema.
type GroupInvite struct {
	config `json:"-"`
	// ID of the ent.
	ID int `json:"id,omitempty"`
	// Secret holds the value of the "secret" field.
	Secret string `json:"secret,omitempty"`
	// Edges holds the relations/edges for other nodes in the graph.
	// The values are being populated by the GroupInviteQuery when eager-loading is set.
	Edges         GroupInviteEdges `json:"edges"`
	group_invites *uuid.UUID
	selectValues  sql.SelectValues
}

// GroupInviteEdges holds the relations/edges for other nodes in the graph.
type GroupInviteEdges struct {
	// Group holds the value of the group edge.
	Group *Group `json:"group,omitempty"`
	// loadedTypes holds the information for reporting if a
	// type was loaded (or requested) in eager-loading or not.
	loadedTypes [1]bool
}

// GroupOrErr returns the Group value or an error if the edge
// was not loaded in eager-loading, or loaded but was not found.
func (e GroupInviteEdges) GroupOrErr() (*Group, error) {
	if e.loadedTypes[0] {
		if e.Group == nil {
			// Edge was loaded but was not found.
			return nil, &NotFoundError{label: group.Label}
		}
		return e.Group, nil
	}
	return nil, &NotLoadedError{edge: "group"}
}

// scanValues returns the types for scanning values from sql.Rows.
func (*GroupInvite) scanValues(columns []string) ([]any, error) {
	values := make([]any, len(columns))
	for i := range columns {
		switch columns[i] {
		case groupinvite.FieldID:
			values[i] = new(sql.NullInt64)
		case groupinvite.FieldSecret:
			values[i] = new(sql.NullString)
		case groupinvite.ForeignKeys[0]: // group_invites
			values[i] = &sql.NullScanner{S: new(uuid.UUID)}
		default:
			values[i] = new(sql.UnknownType)
		}
	}
	return values, nil
}

// assignValues assigns the values that were returned from sql.Rows (after scanning)
// to the GroupInvite fields.
func (gi *GroupInvite) assignValues(columns []string, values []any) error {
	if m, n := len(values), len(columns); m < n {
		return fmt.Errorf("mismatch number of scan values: %d != %d", m, n)
	}
	for i := range columns {
		switch columns[i] {
		case groupinvite.FieldID:
			value, ok := values[i].(*sql.NullInt64)
			if !ok {
				return fmt.Errorf("unexpected type %T for field id", value)
			}
			gi.ID = int(value.Int64)
		case groupinvite.FieldSecret:
			if value, ok := values[i].(*sql.NullString); !ok {
				return fmt.Errorf("unexpected type %T for field secret", values[i])
			} else if value.Valid {
				gi.Secret = value.String
			}
		case groupinvite.ForeignKeys[0]:
			if value, ok := values[i].(*sql.NullScanner); !ok {
				return fmt.Errorf("unexpected type %T for field group_invites", values[i])
			} else if value.Valid {
				gi.group_invites = new(uuid.UUID)
				*gi.group_invites = *value.S.(*uuid.UUID)
			}
		default:
			gi.selectValues.Set(columns[i], values[i])
		}
	}
	return nil
}

// Value returns the ent.Value that was dynamically selected and assigned to the GroupInvite.
// This includes values selected through modifiers, order, etc.
func (gi *GroupInvite) Value(name string) (ent.Value, error) {
	return gi.selectValues.Get(name)
}

// QueryGroup queries the "group" edge of the GroupInvite entity.
func (gi *GroupInvite) QueryGroup() *GroupQuery {
	return NewGroupInviteClient(gi.config).QueryGroup(gi)
}

// Update returns a builder for updating this GroupInvite.
// Note that you need to call GroupInvite.Unwrap() before calling this method if this GroupInvite
// was returned from a transaction, and the transaction was committed or rolled back.
func (gi *GroupInvite) Update() *GroupInviteUpdateOne {
	return NewGroupInviteClient(gi.config).UpdateOne(gi)
}

// Unwrap unwraps the GroupInvite entity that was returned from a transaction after it was closed,
// so that all future queries will be executed through the driver which created the transaction.
func (gi *GroupInvite) Unwrap() *GroupInvite {
	_tx, ok := gi.config.driver.(*txDriver)
	if !ok {
		panic("ent: GroupInvite is not a transactional entity")
	}
	gi.config.driver = _tx.drv
	return gi
}

// String implements the fmt.Stringer.
func (gi *GroupInvite) String() string {
	var builder strings.Builder
	builder.WriteString("GroupInvite(")
	builder.WriteString(fmt.Sprintf("id=%v, ", gi.ID))
	builder.WriteString("secret=")
	builder.WriteString(gi.Secret)
	builder.WriteByte(')')
	return builder.String()
}

// GroupInvites is a parsable slice of GroupInvite.
type GroupInvites []*GroupInvite
