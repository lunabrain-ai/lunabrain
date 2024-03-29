// Code generated by ent, DO NOT EDIT.

package groupinvite

import (
	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
)

const (
	// Label holds the string label denoting the groupinvite type in the database.
	Label = "group_invite"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "id"
	// FieldSecret holds the string denoting the secret field in the database.
	FieldSecret = "secret"
	// EdgeGroup holds the string denoting the group edge name in mutations.
	EdgeGroup = "group"
	// Table holds the table name of the groupinvite in the database.
	Table = "group_invites"
	// GroupTable is the table that holds the group relation/edge.
	GroupTable = "group_invites"
	// GroupInverseTable is the table name for the Group entity.
	// It exists in this package in order to avoid circular dependency with the "group" package.
	GroupInverseTable = "groups"
	// GroupColumn is the table column denoting the group relation/edge.
	GroupColumn = "group_invites"
)

// Columns holds all SQL columns for groupinvite fields.
var Columns = []string{
	FieldID,
	FieldSecret,
}

// ForeignKeys holds the SQL foreign-keys that are owned by the "group_invites"
// table and are not defined as standalone fields in the schema.
var ForeignKeys = []string{
	"group_invites",
}

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

// OrderOption defines the ordering options for the GroupInvite queries.
type OrderOption func(*sql.Selector)

// ByID orders the results by the id field.
func ByID(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldID, opts...).ToFunc()
}

// BySecret orders the results by the secret field.
func BySecret(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldSecret, opts...).ToFunc()
}

// ByGroupField orders the results by group field.
func ByGroupField(field string, opts ...sql.OrderTermOption) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newGroupStep(), sql.OrderByField(field, opts...))
	}
}
func newGroupStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(GroupInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2O, true, GroupTable, GroupColumn),
	)
}
