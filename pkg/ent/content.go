// Code generated by ent, DO NOT EDIT.

package ent

import (
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/sql"
	"github.com/google/uuid"
	"github.com/justshare-io/justshare/pkg/ent/content"
	"github.com/justshare-io/justshare/pkg/ent/schema"
	entuser "github.com/justshare-io/justshare/pkg/ent/user"
)

// Content is the model entity for the Content schema.
type Content struct {
	config `json:"-"`
	// ID of the ent.
	ID uuid.UUID `json:"id,omitempty"`
	// Root holds the value of the "root" field.
	Root bool `json:"root,omitempty"`
	// Data holds the value of the "data" field.
	Data *schema.ContentEncoder `json:"data,omitempty"`
	// CreatedAt holds the value of the "created_at" field.
	CreatedAt time.Time `json:"created_at,omitempty"`
	// UpdatedAt holds the value of the "updated_at" field.
	UpdatedAt time.Time `json:"updated_at,omitempty"`
	// Edges holds the relations/edges for other nodes in the graph.
	// The values are being populated by the ContentQuery when eager-loading is set.
	Edges        ContentEdges `json:"edges"`
	user_content *uuid.UUID
	selectValues sql.SelectValues
}

// ContentEdges holds the relations/edges for other nodes in the graph.
type ContentEdges struct {
	// User holds the value of the user edge.
	User *User `json:"user,omitempty"`
	// Tags holds the value of the tags edge.
	Tags []*Tag `json:"tags,omitempty"`
	// Children holds the value of the children edge.
	Children []*Content `json:"children,omitempty"`
	// Parents holds the value of the parents edge.
	Parents []*Content `json:"parents,omitempty"`
	// Groups holds the value of the groups edge.
	Groups []*Group `json:"groups,omitempty"`
	// loadedTypes holds the information for reporting if a
	// type was loaded (or requested) in eager-loading or not.
	loadedTypes [5]bool
}

// UserOrErr returns the User value or an error if the edge
// was not loaded in eager-loading, or loaded but was not found.
func (e ContentEdges) UserOrErr() (*User, error) {
	if e.loadedTypes[0] {
		if e.User == nil {
			// Edge was loaded but was not found.
			return nil, &NotFoundError{label: entuser.Label}
		}
		return e.User, nil
	}
	return nil, &NotLoadedError{edge: "user"}
}

// TagsOrErr returns the Tags value or an error if the edge
// was not loaded in eager-loading.
func (e ContentEdges) TagsOrErr() ([]*Tag, error) {
	if e.loadedTypes[1] {
		return e.Tags, nil
	}
	return nil, &NotLoadedError{edge: "tags"}
}

// ChildrenOrErr returns the Children value or an error if the edge
// was not loaded in eager-loading.
func (e ContentEdges) ChildrenOrErr() ([]*Content, error) {
	if e.loadedTypes[2] {
		return e.Children, nil
	}
	return nil, &NotLoadedError{edge: "children"}
}

// ParentsOrErr returns the Parents value or an error if the edge
// was not loaded in eager-loading.
func (e ContentEdges) ParentsOrErr() ([]*Content, error) {
	if e.loadedTypes[3] {
		return e.Parents, nil
	}
	return nil, &NotLoadedError{edge: "parents"}
}

// GroupsOrErr returns the Groups value or an error if the edge
// was not loaded in eager-loading.
func (e ContentEdges) GroupsOrErr() ([]*Group, error) {
	if e.loadedTypes[4] {
		return e.Groups, nil
	}
	return nil, &NotLoadedError{edge: "groups"}
}

// scanValues returns the types for scanning values from sql.Rows.
func (*Content) scanValues(columns []string) ([]any, error) {
	values := make([]any, len(columns))
	for i := range columns {
		switch columns[i] {
		case content.FieldData:
			values[i] = new([]byte)
		case content.FieldRoot:
			values[i] = new(sql.NullBool)
		case content.FieldCreatedAt, content.FieldUpdatedAt:
			values[i] = new(sql.NullTime)
		case content.FieldID:
			values[i] = new(uuid.UUID)
		case content.ForeignKeys[0]: // user_content
			values[i] = &sql.NullScanner{S: new(uuid.UUID)}
		default:
			values[i] = new(sql.UnknownType)
		}
	}
	return values, nil
}

// assignValues assigns the values that were returned from sql.Rows (after scanning)
// to the Content fields.
func (c *Content) assignValues(columns []string, values []any) error {
	if m, n := len(values), len(columns); m < n {
		return fmt.Errorf("mismatch number of scan values: %d != %d", m, n)
	}
	for i := range columns {
		switch columns[i] {
		case content.FieldID:
			if value, ok := values[i].(*uuid.UUID); !ok {
				return fmt.Errorf("unexpected type %T for field id", values[i])
			} else if value != nil {
				c.ID = *value
			}
		case content.FieldRoot:
			if value, ok := values[i].(*sql.NullBool); !ok {
				return fmt.Errorf("unexpected type %T for field root", values[i])
			} else if value.Valid {
				c.Root = value.Bool
			}
		case content.FieldData:
			if value, ok := values[i].(*[]byte); !ok {
				return fmt.Errorf("unexpected type %T for field data", values[i])
			} else if value != nil && len(*value) > 0 {
				if err := json.Unmarshal(*value, &c.Data); err != nil {
					return fmt.Errorf("unmarshal field data: %w", err)
				}
			}
		case content.FieldCreatedAt:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field created_at", values[i])
			} else if value.Valid {
				c.CreatedAt = value.Time
			}
		case content.FieldUpdatedAt:
			if value, ok := values[i].(*sql.NullTime); !ok {
				return fmt.Errorf("unexpected type %T for field updated_at", values[i])
			} else if value.Valid {
				c.UpdatedAt = value.Time
			}
		case content.ForeignKeys[0]:
			if value, ok := values[i].(*sql.NullScanner); !ok {
				return fmt.Errorf("unexpected type %T for field user_content", values[i])
			} else if value.Valid {
				c.user_content = new(uuid.UUID)
				*c.user_content = *value.S.(*uuid.UUID)
			}
		default:
			c.selectValues.Set(columns[i], values[i])
		}
	}
	return nil
}

// Value returns the ent.Value that was dynamically selected and assigned to the Content.
// This includes values selected through modifiers, order, etc.
func (c *Content) Value(name string) (ent.Value, error) {
	return c.selectValues.Get(name)
}

// QueryUser queries the "user" edge of the Content entity.
func (c *Content) QueryUser() *UserQuery {
	return NewContentClient(c.config).QueryUser(c)
}

// QueryTags queries the "tags" edge of the Content entity.
func (c *Content) QueryTags() *TagQuery {
	return NewContentClient(c.config).QueryTags(c)
}

// QueryChildren queries the "children" edge of the Content entity.
func (c *Content) QueryChildren() *ContentQuery {
	return NewContentClient(c.config).QueryChildren(c)
}

// QueryParents queries the "parents" edge of the Content entity.
func (c *Content) QueryParents() *ContentQuery {
	return NewContentClient(c.config).QueryParents(c)
}

// QueryGroups queries the "groups" edge of the Content entity.
func (c *Content) QueryGroups() *GroupQuery {
	return NewContentClient(c.config).QueryGroups(c)
}

// Update returns a builder for updating this Content.
// Note that you need to call Content.Unwrap() before calling this method if this Content
// was returned from a transaction, and the transaction was committed or rolled back.
func (c *Content) Update() *ContentUpdateOne {
	return NewContentClient(c.config).UpdateOne(c)
}

// Unwrap unwraps the Content entity that was returned from a transaction after it was closed,
// so that all future queries will be executed through the driver which created the transaction.
func (c *Content) Unwrap() *Content {
	_tx, ok := c.config.driver.(*txDriver)
	if !ok {
		panic("ent: Content is not a transactional entity")
	}
	c.config.driver = _tx.drv
	return c
}

// String implements the fmt.Stringer.
func (c *Content) String() string {
	var builder strings.Builder
	builder.WriteString("Content(")
	builder.WriteString(fmt.Sprintf("id=%v, ", c.ID))
	builder.WriteString("root=")
	builder.WriteString(fmt.Sprintf("%v", c.Root))
	builder.WriteString(", ")
	builder.WriteString("data=")
	builder.WriteString(fmt.Sprintf("%v", c.Data))
	builder.WriteString(", ")
	builder.WriteString("created_at=")
	builder.WriteString(c.CreatedAt.Format(time.ANSIC))
	builder.WriteString(", ")
	builder.WriteString("updated_at=")
	builder.WriteString(c.UpdatedAt.Format(time.ANSIC))
	builder.WriteByte(')')
	return builder.String()
}

// Contents is a parsable slice of Content.
type Contents []*Content
