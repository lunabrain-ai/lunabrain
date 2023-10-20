// Code generated by ent, DO NOT EDIT.

package vote

import (
	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"github.com/google/uuid"
)

const (
	// Label holds the string label denoting the vote type in the database.
	Label = "vote"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "oid"
	// EdgeContent holds the string denoting the content edge name in mutations.
	EdgeContent = "content"
	// EdgeUser holds the string denoting the user edge name in mutations.
	EdgeUser = "user"
	// Table holds the table name of the vote in the database.
	Table = "votes"
	// ContentTable is the table that holds the content relation/edge. The primary key declared below.
	ContentTable = "content_votes"
	// ContentInverseTable is the table name for the Content entity.
	// It exists in this package in order to avoid circular dependency with the "content" package.
	ContentInverseTable = "contents"
	// UserTable is the table that holds the user relation/edge.
	UserTable = "votes"
	// UserInverseTable is the table name for the User entity.
	// It exists in this package in order to avoid circular dependency with the "entuser" package.
	UserInverseTable = "users"
	// UserColumn is the table column denoting the user relation/edge.
	UserColumn = "user_votes"
)

// Columns holds all SQL columns for vote fields.
var Columns = []string{
	FieldID,
}

// ForeignKeys holds the SQL foreign-keys that are owned by the "votes"
// table and are not defined as standalone fields in the schema.
var ForeignKeys = []string{
	"user_votes",
}

var (
	// ContentPrimaryKey and ContentColumn2 are the table columns denoting the
	// primary key for the content relation (M2M).
	ContentPrimaryKey = []string{"content_id", "vote_id"}
)

// ValidColumn reports if the column name is valid (part of the table columns).
func ValidColumn(column string) bool {
	for i := range Columns {
		if column == Columns[i] {
			return true
		}
	}
	for i := range ForeignKeys {
		if column == ForeignKeys[i] {
			return true
		}
	}
	return false
}

var (
	// DefaultID holds the default value on creation for the "id" field.
	DefaultID func() uuid.UUID
)

// OrderOption defines the ordering options for the Vote queries.
type OrderOption func(*sql.Selector)

// ByID orders the results by the id field.
func ByID(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldID, opts...).ToFunc()
}

// ByContentCount orders the results by content count.
func ByContentCount(opts ...sql.OrderTermOption) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborsCount(s, newContentStep(), opts...)
	}
}

// ByContent orders the results by content terms.
func ByContent(term sql.OrderTerm, terms ...sql.OrderTerm) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newContentStep(), append([]sql.OrderTerm{term}, terms...)...)
	}
}

// ByUserField orders the results by user field.
func ByUserField(field string, opts ...sql.OrderTermOption) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newUserStep(), sql.OrderByField(field, opts...))
	}
}
func newContentStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(ContentInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2M, true, ContentTable, ContentPrimaryKey...),
	)
}
func newUserStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(UserInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2O, true, UserTable, UserColumn),
	)
}
