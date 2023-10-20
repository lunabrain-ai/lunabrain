// Code generated by ent, DO NOT EDIT.

package group

import (
	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"github.com/google/uuid"
)

const (
	// Label holds the string label denoting the group type in the database.
	Label = "group"
	// FieldID holds the string denoting the id field in the database.
	FieldID = "oid"
	// FieldData holds the string denoting the data field in the database.
	FieldData = "data"
	// EdgeGroupUsers holds the string denoting the group_users edge name in mutations.
	EdgeGroupUsers = "group_users"
	// EdgeInvites holds the string denoting the invites edge name in mutations.
	EdgeInvites = "invites"
	// EdgeContent holds the string denoting the content edge name in mutations.
	EdgeContent = "content"
	// EdgeTags holds the string denoting the tags edge name in mutations.
	EdgeTags = "tags"
	// GroupInviteFieldID holds the string denoting the ID field of the GroupInvite.
	GroupInviteFieldID = "id"
	// Table holds the table name of the group in the database.
	Table = "groups"
	// GroupUsersTable is the table that holds the group_users relation/edge.
	GroupUsersTable = "group_users"
	// GroupUsersInverseTable is the table name for the GroupUser entity.
	// It exists in this package in order to avoid circular dependency with the "groupuser" package.
	GroupUsersInverseTable = "group_users"
	// GroupUsersColumn is the table column denoting the group_users relation/edge.
	GroupUsersColumn = "group_group_users"
	// InvitesTable is the table that holds the invites relation/edge.
	InvitesTable = "group_invites"
	// InvitesInverseTable is the table name for the GroupInvite entity.
	// It exists in this package in order to avoid circular dependency with the "groupinvite" package.
	InvitesInverseTable = "group_invites"
	// InvitesColumn is the table column denoting the invites relation/edge.
	InvitesColumn = "group_invites"
	// ContentTable is the table that holds the content relation/edge. The primary key declared below.
	ContentTable = "content_groups"
	// ContentInverseTable is the table name for the Content entity.
	// It exists in this package in order to avoid circular dependency with the "content" package.
	ContentInverseTable = "contents"
	// TagsTable is the table that holds the tags relation/edge.
	TagsTable = "tags"
	// TagsInverseTable is the table name for the Tag entity.
	// It exists in this package in order to avoid circular dependency with the "tag" package.
	TagsInverseTable = "tags"
	// TagsColumn is the table column denoting the tags relation/edge.
	TagsColumn = "group_tags"
)

// Columns holds all SQL columns for group fields.
var Columns = []string{
	FieldID,
	FieldData,
}

var (
	// ContentPrimaryKey and ContentColumn2 are the table columns denoting the
	// primary key for the content relation (M2M).
	ContentPrimaryKey = []string{"content_id", "group_id"}
)

// ValidColumn reports if the column name is valid (part of the table columns).
func ValidColumn(column string) bool {
	for i := range Columns {
		if column == Columns[i] {
			return true
		}
	}
	return false
}

var (
	// DefaultID holds the default value on creation for the "id" field.
	DefaultID func() uuid.UUID
)

// OrderOption defines the ordering options for the Group queries.
type OrderOption func(*sql.Selector)

// ByID orders the results by the id field.
func ByID(opts ...sql.OrderTermOption) OrderOption {
	return sql.OrderByField(FieldID, opts...).ToFunc()
}

// ByGroupUsersCount orders the results by group_users count.
func ByGroupUsersCount(opts ...sql.OrderTermOption) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborsCount(s, newGroupUsersStep(), opts...)
	}
}

// ByGroupUsers orders the results by group_users terms.
func ByGroupUsers(term sql.OrderTerm, terms ...sql.OrderTerm) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newGroupUsersStep(), append([]sql.OrderTerm{term}, terms...)...)
	}
}

// ByInvitesCount orders the results by invites count.
func ByInvitesCount(opts ...sql.OrderTermOption) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborsCount(s, newInvitesStep(), opts...)
	}
}

// ByInvites orders the results by invites terms.
func ByInvites(term sql.OrderTerm, terms ...sql.OrderTerm) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newInvitesStep(), append([]sql.OrderTerm{term}, terms...)...)
	}
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

// ByTagsCount orders the results by tags count.
func ByTagsCount(opts ...sql.OrderTermOption) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborsCount(s, newTagsStep(), opts...)
	}
}

// ByTags orders the results by tags terms.
func ByTags(term sql.OrderTerm, terms ...sql.OrderTerm) OrderOption {
	return func(s *sql.Selector) {
		sqlgraph.OrderByNeighborTerms(s, newTagsStep(), append([]sql.OrderTerm{term}, terms...)...)
	}
}
func newGroupUsersStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(GroupUsersInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.O2M, false, GroupUsersTable, GroupUsersColumn),
	)
}
func newInvitesStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(InvitesInverseTable, GroupInviteFieldID),
		sqlgraph.Edge(sqlgraph.O2M, false, InvitesTable, InvitesColumn),
	)
}
func newContentStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(ContentInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.M2M, true, ContentTable, ContentPrimaryKey...),
	)
}
func newTagsStep() *sqlgraph.Step {
	return sqlgraph.NewStep(
		sqlgraph.From(Table, FieldID),
		sqlgraph.To(TagsInverseTable, FieldID),
		sqlgraph.Edge(sqlgraph.O2M, false, TagsTable, TagsColumn),
	)
}
