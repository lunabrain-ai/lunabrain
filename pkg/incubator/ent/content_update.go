// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/pkg/incubator/ent/content"
	"github.com/lunabrain-ai/lunabrain/pkg/incubator/ent/group"
	"github.com/lunabrain-ai/lunabrain/pkg/incubator/ent/predicate"
	"github.com/lunabrain-ai/lunabrain/pkg/incubator/ent/schema"
	"github.com/lunabrain-ai/lunabrain/pkg/incubator/ent/tag"
	entuser "github.com/lunabrain-ai/lunabrain/pkg/incubator/ent/user"
	"github.com/lunabrain-ai/lunabrain/pkg/incubator/ent/vote"
)

// ContentUpdate is the builder for updating Content entities.
type ContentUpdate struct {
	config
	hooks    []Hook
	mutation *ContentMutation
}

// Where appends a list predicates to the ContentUpdate builder.
func (cu *ContentUpdate) Where(ps ...predicate.Content) *ContentUpdate {
	cu.mutation.Where(ps...)
	return cu
}

// SetRoot sets the "root" field.
func (cu *ContentUpdate) SetRoot(b bool) *ContentUpdate {
	cu.mutation.SetRoot(b)
	return cu
}

// SetVisitCount sets the "visit_count" field.
func (cu *ContentUpdate) SetVisitCount(i int64) *ContentUpdate {
	cu.mutation.ResetVisitCount()
	cu.mutation.SetVisitCount(i)
	return cu
}

// AddVisitCount adds i to the "visit_count" field.
func (cu *ContentUpdate) AddVisitCount(i int64) *ContentUpdate {
	cu.mutation.AddVisitCount(i)
	return cu
}

// SetData sets the "data" field.
func (cu *ContentUpdate) SetData(se schema.ContentEncoder) *ContentUpdate {
	cu.mutation.SetData(se)
	return cu
}

// SetUserID sets the "user" edge to the User entity by ID.
func (cu *ContentUpdate) SetUserID(id uuid.UUID) *ContentUpdate {
	cu.mutation.SetUserID(id)
	return cu
}

// SetNillableUserID sets the "user" edge to the User entity by ID if the given value is not nil.
func (cu *ContentUpdate) SetNillableUserID(id *uuid.UUID) *ContentUpdate {
	if id != nil {
		cu = cu.SetUserID(*id)
	}
	return cu
}

// SetUser sets the "user" edge to the User entity.
func (cu *ContentUpdate) SetUser(u *User) *ContentUpdate {
	return cu.SetUserID(u.ID)
}

// AddTagIDs adds the "tags" edge to the Tag entity by IDs.
func (cu *ContentUpdate) AddTagIDs(ids ...uuid.UUID) *ContentUpdate {
	cu.mutation.AddTagIDs(ids...)
	return cu
}

// AddTags adds the "tags" edges to the Tag entity.
func (cu *ContentUpdate) AddTags(t ...*Tag) *ContentUpdate {
	ids := make([]uuid.UUID, len(t))
	for i := range t {
		ids[i] = t[i].ID
	}
	return cu.AddTagIDs(ids...)
}

// AddChildIDs adds the "children" edge to the Content entity by IDs.
func (cu *ContentUpdate) AddChildIDs(ids ...uuid.UUID) *ContentUpdate {
	cu.mutation.AddChildIDs(ids...)
	return cu
}

// AddChildren adds the "children" edges to the Content entity.
func (cu *ContentUpdate) AddChildren(c ...*Content) *ContentUpdate {
	ids := make([]uuid.UUID, len(c))
	for i := range c {
		ids[i] = c[i].ID
	}
	return cu.AddChildIDs(ids...)
}

// AddParentIDs adds the "parents" edge to the Content entity by IDs.
func (cu *ContentUpdate) AddParentIDs(ids ...uuid.UUID) *ContentUpdate {
	cu.mutation.AddParentIDs(ids...)
	return cu
}

// AddParents adds the "parents" edges to the Content entity.
func (cu *ContentUpdate) AddParents(c ...*Content) *ContentUpdate {
	ids := make([]uuid.UUID, len(c))
	for i := range c {
		ids[i] = c[i].ID
	}
	return cu.AddParentIDs(ids...)
}

// AddVoteIDs adds the "votes" edge to the Vote entity by IDs.
func (cu *ContentUpdate) AddVoteIDs(ids ...uuid.UUID) *ContentUpdate {
	cu.mutation.AddVoteIDs(ids...)
	return cu
}

// AddVotes adds the "votes" edges to the Vote entity.
func (cu *ContentUpdate) AddVotes(v ...*Vote) *ContentUpdate {
	ids := make([]uuid.UUID, len(v))
	for i := range v {
		ids[i] = v[i].ID
	}
	return cu.AddVoteIDs(ids...)
}

// AddGroupIDs adds the "groups" edge to the Group entity by IDs.
func (cu *ContentUpdate) AddGroupIDs(ids ...uuid.UUID) *ContentUpdate {
	cu.mutation.AddGroupIDs(ids...)
	return cu
}

// AddGroups adds the "groups" edges to the Group entity.
func (cu *ContentUpdate) AddGroups(g ...*Group) *ContentUpdate {
	ids := make([]uuid.UUID, len(g))
	for i := range g {
		ids[i] = g[i].ID
	}
	return cu.AddGroupIDs(ids...)
}

// Mutation returns the ContentMutation object of the builder.
func (cu *ContentUpdate) Mutation() *ContentMutation {
	return cu.mutation
}

// ClearUser clears the "user" edge to the User entity.
func (cu *ContentUpdate) ClearUser() *ContentUpdate {
	cu.mutation.ClearUser()
	return cu
}

// ClearTags clears all "tags" edges to the Tag entity.
func (cu *ContentUpdate) ClearTags() *ContentUpdate {
	cu.mutation.ClearTags()
	return cu
}

// RemoveTagIDs removes the "tags" edge to Tag entities by IDs.
func (cu *ContentUpdate) RemoveTagIDs(ids ...uuid.UUID) *ContentUpdate {
	cu.mutation.RemoveTagIDs(ids...)
	return cu
}

// RemoveTags removes "tags" edges to Tag entities.
func (cu *ContentUpdate) RemoveTags(t ...*Tag) *ContentUpdate {
	ids := make([]uuid.UUID, len(t))
	for i := range t {
		ids[i] = t[i].ID
	}
	return cu.RemoveTagIDs(ids...)
}

// ClearChildren clears all "children" edges to the Content entity.
func (cu *ContentUpdate) ClearChildren() *ContentUpdate {
	cu.mutation.ClearChildren()
	return cu
}

// RemoveChildIDs removes the "children" edge to Content entities by IDs.
func (cu *ContentUpdate) RemoveChildIDs(ids ...uuid.UUID) *ContentUpdate {
	cu.mutation.RemoveChildIDs(ids...)
	return cu
}

// RemoveChildren removes "children" edges to Content entities.
func (cu *ContentUpdate) RemoveChildren(c ...*Content) *ContentUpdate {
	ids := make([]uuid.UUID, len(c))
	for i := range c {
		ids[i] = c[i].ID
	}
	return cu.RemoveChildIDs(ids...)
}

// ClearParents clears all "parents" edges to the Content entity.
func (cu *ContentUpdate) ClearParents() *ContentUpdate {
	cu.mutation.ClearParents()
	return cu
}

// RemoveParentIDs removes the "parents" edge to Content entities by IDs.
func (cu *ContentUpdate) RemoveParentIDs(ids ...uuid.UUID) *ContentUpdate {
	cu.mutation.RemoveParentIDs(ids...)
	return cu
}

// RemoveParents removes "parents" edges to Content entities.
func (cu *ContentUpdate) RemoveParents(c ...*Content) *ContentUpdate {
	ids := make([]uuid.UUID, len(c))
	for i := range c {
		ids[i] = c[i].ID
	}
	return cu.RemoveParentIDs(ids...)
}

// ClearVotes clears all "votes" edges to the Vote entity.
func (cu *ContentUpdate) ClearVotes() *ContentUpdate {
	cu.mutation.ClearVotes()
	return cu
}

// RemoveVoteIDs removes the "votes" edge to Vote entities by IDs.
func (cu *ContentUpdate) RemoveVoteIDs(ids ...uuid.UUID) *ContentUpdate {
	cu.mutation.RemoveVoteIDs(ids...)
	return cu
}

// RemoveVotes removes "votes" edges to Vote entities.
func (cu *ContentUpdate) RemoveVotes(v ...*Vote) *ContentUpdate {
	ids := make([]uuid.UUID, len(v))
	for i := range v {
		ids[i] = v[i].ID
	}
	return cu.RemoveVoteIDs(ids...)
}

// ClearGroups clears all "groups" edges to the Group entity.
func (cu *ContentUpdate) ClearGroups() *ContentUpdate {
	cu.mutation.ClearGroups()
	return cu
}

// RemoveGroupIDs removes the "groups" edge to Group entities by IDs.
func (cu *ContentUpdate) RemoveGroupIDs(ids ...uuid.UUID) *ContentUpdate {
	cu.mutation.RemoveGroupIDs(ids...)
	return cu
}

// RemoveGroups removes "groups" edges to Group entities.
func (cu *ContentUpdate) RemoveGroups(g ...*Group) *ContentUpdate {
	ids := make([]uuid.UUID, len(g))
	for i := range g {
		ids[i] = g[i].ID
	}
	return cu.RemoveGroupIDs(ids...)
}

// Save executes the query and returns the number of nodes affected by the update operation.
func (cu *ContentUpdate) Save(ctx context.Context) (int, error) {
	return withHooks(ctx, cu.sqlSave, cu.mutation, cu.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (cu *ContentUpdate) SaveX(ctx context.Context) int {
	affected, err := cu.Save(ctx)
	if err != nil {
		panic(err)
	}
	return affected
}

// Exec executes the query.
func (cu *ContentUpdate) Exec(ctx context.Context) error {
	_, err := cu.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (cu *ContentUpdate) ExecX(ctx context.Context) {
	if err := cu.Exec(ctx); err != nil {
		panic(err)
	}
}

func (cu *ContentUpdate) sqlSave(ctx context.Context) (n int, err error) {
	_spec := sqlgraph.NewUpdateSpec(content.Table, content.Columns, sqlgraph.NewFieldSpec(content.FieldID, field.TypeUUID))
	if ps := cu.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := cu.mutation.Root(); ok {
		_spec.SetField(content.FieldRoot, field.TypeBool, value)
	}
	if value, ok := cu.mutation.VisitCount(); ok {
		_spec.SetField(content.FieldVisitCount, field.TypeInt64, value)
	}
	if value, ok := cu.mutation.AddedVisitCount(); ok {
		_spec.AddField(content.FieldVisitCount, field.TypeInt64, value)
	}
	if value, ok := cu.mutation.Data(); ok {
		_spec.SetField(content.FieldData, field.TypeJSON, value)
	}
	if cu.mutation.UserCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   content.UserTable,
			Columns: []string{content.UserColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(entuser.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cu.mutation.UserIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   content.UserTable,
			Columns: []string{content.UserColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(entuser.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if cu.mutation.TagsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   content.TagsTable,
			Columns: content.TagsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(tag.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cu.mutation.RemovedTagsIDs(); len(nodes) > 0 && !cu.mutation.TagsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   content.TagsTable,
			Columns: content.TagsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(tag.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cu.mutation.TagsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   content.TagsTable,
			Columns: content.TagsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(tag.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if cu.mutation.ChildrenCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   content.ChildrenTable,
			Columns: content.ChildrenPrimaryKey,
			Bidi:    true,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(content.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cu.mutation.RemovedChildrenIDs(); len(nodes) > 0 && !cu.mutation.ChildrenCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   content.ChildrenTable,
			Columns: content.ChildrenPrimaryKey,
			Bidi:    true,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(content.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cu.mutation.ChildrenIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   content.ChildrenTable,
			Columns: content.ChildrenPrimaryKey,
			Bidi:    true,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(content.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if cu.mutation.ParentsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   content.ParentsTable,
			Columns: content.ParentsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(content.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cu.mutation.RemovedParentsIDs(); len(nodes) > 0 && !cu.mutation.ParentsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   content.ParentsTable,
			Columns: content.ParentsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(content.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cu.mutation.ParentsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   content.ParentsTable,
			Columns: content.ParentsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(content.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if cu.mutation.VotesCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   content.VotesTable,
			Columns: content.VotesPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(vote.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cu.mutation.RemovedVotesIDs(); len(nodes) > 0 && !cu.mutation.VotesCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   content.VotesTable,
			Columns: content.VotesPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(vote.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cu.mutation.VotesIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   content.VotesTable,
			Columns: content.VotesPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(vote.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if cu.mutation.GroupsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   content.GroupsTable,
			Columns: content.GroupsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(group.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cu.mutation.RemovedGroupsIDs(); len(nodes) > 0 && !cu.mutation.GroupsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   content.GroupsTable,
			Columns: content.GroupsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(group.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cu.mutation.GroupsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   content.GroupsTable,
			Columns: content.GroupsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(group.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if n, err = sqlgraph.UpdateNodes(ctx, cu.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{content.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return 0, err
	}
	cu.mutation.done = true
	return n, nil
}

// ContentUpdateOne is the builder for updating a single Content entity.
type ContentUpdateOne struct {
	config
	fields   []string
	hooks    []Hook
	mutation *ContentMutation
}

// SetRoot sets the "root" field.
func (cuo *ContentUpdateOne) SetRoot(b bool) *ContentUpdateOne {
	cuo.mutation.SetRoot(b)
	return cuo
}

// SetVisitCount sets the "visit_count" field.
func (cuo *ContentUpdateOne) SetVisitCount(i int64) *ContentUpdateOne {
	cuo.mutation.ResetVisitCount()
	cuo.mutation.SetVisitCount(i)
	return cuo
}

// AddVisitCount adds i to the "visit_count" field.
func (cuo *ContentUpdateOne) AddVisitCount(i int64) *ContentUpdateOne {
	cuo.mutation.AddVisitCount(i)
	return cuo
}

// SetData sets the "data" field.
func (cuo *ContentUpdateOne) SetData(se schema.ContentEncoder) *ContentUpdateOne {
	cuo.mutation.SetData(se)
	return cuo
}

// SetUserID sets the "user" edge to the User entity by ID.
func (cuo *ContentUpdateOne) SetUserID(id uuid.UUID) *ContentUpdateOne {
	cuo.mutation.SetUserID(id)
	return cuo
}

// SetNillableUserID sets the "user" edge to the User entity by ID if the given value is not nil.
func (cuo *ContentUpdateOne) SetNillableUserID(id *uuid.UUID) *ContentUpdateOne {
	if id != nil {
		cuo = cuo.SetUserID(*id)
	}
	return cuo
}

// SetUser sets the "user" edge to the User entity.
func (cuo *ContentUpdateOne) SetUser(u *User) *ContentUpdateOne {
	return cuo.SetUserID(u.ID)
}

// AddTagIDs adds the "tags" edge to the Tag entity by IDs.
func (cuo *ContentUpdateOne) AddTagIDs(ids ...uuid.UUID) *ContentUpdateOne {
	cuo.mutation.AddTagIDs(ids...)
	return cuo
}

// AddTags adds the "tags" edges to the Tag entity.
func (cuo *ContentUpdateOne) AddTags(t ...*Tag) *ContentUpdateOne {
	ids := make([]uuid.UUID, len(t))
	for i := range t {
		ids[i] = t[i].ID
	}
	return cuo.AddTagIDs(ids...)
}

// AddChildIDs adds the "children" edge to the Content entity by IDs.
func (cuo *ContentUpdateOne) AddChildIDs(ids ...uuid.UUID) *ContentUpdateOne {
	cuo.mutation.AddChildIDs(ids...)
	return cuo
}

// AddChildren adds the "children" edges to the Content entity.
func (cuo *ContentUpdateOne) AddChildren(c ...*Content) *ContentUpdateOne {
	ids := make([]uuid.UUID, len(c))
	for i := range c {
		ids[i] = c[i].ID
	}
	return cuo.AddChildIDs(ids...)
}

// AddParentIDs adds the "parents" edge to the Content entity by IDs.
func (cuo *ContentUpdateOne) AddParentIDs(ids ...uuid.UUID) *ContentUpdateOne {
	cuo.mutation.AddParentIDs(ids...)
	return cuo
}

// AddParents adds the "parents" edges to the Content entity.
func (cuo *ContentUpdateOne) AddParents(c ...*Content) *ContentUpdateOne {
	ids := make([]uuid.UUID, len(c))
	for i := range c {
		ids[i] = c[i].ID
	}
	return cuo.AddParentIDs(ids...)
}

// AddVoteIDs adds the "votes" edge to the Vote entity by IDs.
func (cuo *ContentUpdateOne) AddVoteIDs(ids ...uuid.UUID) *ContentUpdateOne {
	cuo.mutation.AddVoteIDs(ids...)
	return cuo
}

// AddVotes adds the "votes" edges to the Vote entity.
func (cuo *ContentUpdateOne) AddVotes(v ...*Vote) *ContentUpdateOne {
	ids := make([]uuid.UUID, len(v))
	for i := range v {
		ids[i] = v[i].ID
	}
	return cuo.AddVoteIDs(ids...)
}

// AddGroupIDs adds the "groups" edge to the Group entity by IDs.
func (cuo *ContentUpdateOne) AddGroupIDs(ids ...uuid.UUID) *ContentUpdateOne {
	cuo.mutation.AddGroupIDs(ids...)
	return cuo
}

// AddGroups adds the "groups" edges to the Group entity.
func (cuo *ContentUpdateOne) AddGroups(g ...*Group) *ContentUpdateOne {
	ids := make([]uuid.UUID, len(g))
	for i := range g {
		ids[i] = g[i].ID
	}
	return cuo.AddGroupIDs(ids...)
}

// Mutation returns the ContentMutation object of the builder.
func (cuo *ContentUpdateOne) Mutation() *ContentMutation {
	return cuo.mutation
}

// ClearUser clears the "user" edge to the User entity.
func (cuo *ContentUpdateOne) ClearUser() *ContentUpdateOne {
	cuo.mutation.ClearUser()
	return cuo
}

// ClearTags clears all "tags" edges to the Tag entity.
func (cuo *ContentUpdateOne) ClearTags() *ContentUpdateOne {
	cuo.mutation.ClearTags()
	return cuo
}

// RemoveTagIDs removes the "tags" edge to Tag entities by IDs.
func (cuo *ContentUpdateOne) RemoveTagIDs(ids ...uuid.UUID) *ContentUpdateOne {
	cuo.mutation.RemoveTagIDs(ids...)
	return cuo
}

// RemoveTags removes "tags" edges to Tag entities.
func (cuo *ContentUpdateOne) RemoveTags(t ...*Tag) *ContentUpdateOne {
	ids := make([]uuid.UUID, len(t))
	for i := range t {
		ids[i] = t[i].ID
	}
	return cuo.RemoveTagIDs(ids...)
}

// ClearChildren clears all "children" edges to the Content entity.
func (cuo *ContentUpdateOne) ClearChildren() *ContentUpdateOne {
	cuo.mutation.ClearChildren()
	return cuo
}

// RemoveChildIDs removes the "children" edge to Content entities by IDs.
func (cuo *ContentUpdateOne) RemoveChildIDs(ids ...uuid.UUID) *ContentUpdateOne {
	cuo.mutation.RemoveChildIDs(ids...)
	return cuo
}

// RemoveChildren removes "children" edges to Content entities.
func (cuo *ContentUpdateOne) RemoveChildren(c ...*Content) *ContentUpdateOne {
	ids := make([]uuid.UUID, len(c))
	for i := range c {
		ids[i] = c[i].ID
	}
	return cuo.RemoveChildIDs(ids...)
}

// ClearParents clears all "parents" edges to the Content entity.
func (cuo *ContentUpdateOne) ClearParents() *ContentUpdateOne {
	cuo.mutation.ClearParents()
	return cuo
}

// RemoveParentIDs removes the "parents" edge to Content entities by IDs.
func (cuo *ContentUpdateOne) RemoveParentIDs(ids ...uuid.UUID) *ContentUpdateOne {
	cuo.mutation.RemoveParentIDs(ids...)
	return cuo
}

// RemoveParents removes "parents" edges to Content entities.
func (cuo *ContentUpdateOne) RemoveParents(c ...*Content) *ContentUpdateOne {
	ids := make([]uuid.UUID, len(c))
	for i := range c {
		ids[i] = c[i].ID
	}
	return cuo.RemoveParentIDs(ids...)
}

// ClearVotes clears all "votes" edges to the Vote entity.
func (cuo *ContentUpdateOne) ClearVotes() *ContentUpdateOne {
	cuo.mutation.ClearVotes()
	return cuo
}

// RemoveVoteIDs removes the "votes" edge to Vote entities by IDs.
func (cuo *ContentUpdateOne) RemoveVoteIDs(ids ...uuid.UUID) *ContentUpdateOne {
	cuo.mutation.RemoveVoteIDs(ids...)
	return cuo
}

// RemoveVotes removes "votes" edges to Vote entities.
func (cuo *ContentUpdateOne) RemoveVotes(v ...*Vote) *ContentUpdateOne {
	ids := make([]uuid.UUID, len(v))
	for i := range v {
		ids[i] = v[i].ID
	}
	return cuo.RemoveVoteIDs(ids...)
}

// ClearGroups clears all "groups" edges to the Group entity.
func (cuo *ContentUpdateOne) ClearGroups() *ContentUpdateOne {
	cuo.mutation.ClearGroups()
	return cuo
}

// RemoveGroupIDs removes the "groups" edge to Group entities by IDs.
func (cuo *ContentUpdateOne) RemoveGroupIDs(ids ...uuid.UUID) *ContentUpdateOne {
	cuo.mutation.RemoveGroupIDs(ids...)
	return cuo
}

// RemoveGroups removes "groups" edges to Group entities.
func (cuo *ContentUpdateOne) RemoveGroups(g ...*Group) *ContentUpdateOne {
	ids := make([]uuid.UUID, len(g))
	for i := range g {
		ids[i] = g[i].ID
	}
	return cuo.RemoveGroupIDs(ids...)
}

// Where appends a list predicates to the ContentUpdate builder.
func (cuo *ContentUpdateOne) Where(ps ...predicate.Content) *ContentUpdateOne {
	cuo.mutation.Where(ps...)
	return cuo
}

// Select allows selecting one or more fields (columns) of the returned entity.
// The default is selecting all fields defined in the entity schema.
func (cuo *ContentUpdateOne) Select(field string, fields ...string) *ContentUpdateOne {
	cuo.fields = append([]string{field}, fields...)
	return cuo
}

// Save executes the query and returns the updated Content entity.
func (cuo *ContentUpdateOne) Save(ctx context.Context) (*Content, error) {
	return withHooks(ctx, cuo.sqlSave, cuo.mutation, cuo.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (cuo *ContentUpdateOne) SaveX(ctx context.Context) *Content {
	node, err := cuo.Save(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// Exec executes the query on the entity.
func (cuo *ContentUpdateOne) Exec(ctx context.Context) error {
	_, err := cuo.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (cuo *ContentUpdateOne) ExecX(ctx context.Context) {
	if err := cuo.Exec(ctx); err != nil {
		panic(err)
	}
}

func (cuo *ContentUpdateOne) sqlSave(ctx context.Context) (_node *Content, err error) {
	_spec := sqlgraph.NewUpdateSpec(content.Table, content.Columns, sqlgraph.NewFieldSpec(content.FieldID, field.TypeUUID))
	id, ok := cuo.mutation.ID()
	if !ok {
		return nil, &ValidationError{Name: "id", err: errors.New(`ent: missing "Content.id" for update`)}
	}
	_spec.Node.ID.Value = id
	if fields := cuo.fields; len(fields) > 0 {
		_spec.Node.Columns = make([]string, 0, len(fields))
		_spec.Node.Columns = append(_spec.Node.Columns, content.FieldID)
		for _, f := range fields {
			if !content.ValidColumn(f) {
				return nil, &ValidationError{Name: f, err: fmt.Errorf("ent: invalid field %q for query", f)}
			}
			if f != content.FieldID {
				_spec.Node.Columns = append(_spec.Node.Columns, f)
			}
		}
	}
	if ps := cuo.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := cuo.mutation.Root(); ok {
		_spec.SetField(content.FieldRoot, field.TypeBool, value)
	}
	if value, ok := cuo.mutation.VisitCount(); ok {
		_spec.SetField(content.FieldVisitCount, field.TypeInt64, value)
	}
	if value, ok := cuo.mutation.AddedVisitCount(); ok {
		_spec.AddField(content.FieldVisitCount, field.TypeInt64, value)
	}
	if value, ok := cuo.mutation.Data(); ok {
		_spec.SetField(content.FieldData, field.TypeJSON, value)
	}
	if cuo.mutation.UserCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   content.UserTable,
			Columns: []string{content.UserColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(entuser.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cuo.mutation.UserIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   content.UserTable,
			Columns: []string{content.UserColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(entuser.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if cuo.mutation.TagsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   content.TagsTable,
			Columns: content.TagsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(tag.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cuo.mutation.RemovedTagsIDs(); len(nodes) > 0 && !cuo.mutation.TagsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   content.TagsTable,
			Columns: content.TagsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(tag.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cuo.mutation.TagsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   content.TagsTable,
			Columns: content.TagsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(tag.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if cuo.mutation.ChildrenCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   content.ChildrenTable,
			Columns: content.ChildrenPrimaryKey,
			Bidi:    true,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(content.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cuo.mutation.RemovedChildrenIDs(); len(nodes) > 0 && !cuo.mutation.ChildrenCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   content.ChildrenTable,
			Columns: content.ChildrenPrimaryKey,
			Bidi:    true,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(content.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cuo.mutation.ChildrenIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   content.ChildrenTable,
			Columns: content.ChildrenPrimaryKey,
			Bidi:    true,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(content.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if cuo.mutation.ParentsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   content.ParentsTable,
			Columns: content.ParentsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(content.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cuo.mutation.RemovedParentsIDs(); len(nodes) > 0 && !cuo.mutation.ParentsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   content.ParentsTable,
			Columns: content.ParentsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(content.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cuo.mutation.ParentsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   content.ParentsTable,
			Columns: content.ParentsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(content.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if cuo.mutation.VotesCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   content.VotesTable,
			Columns: content.VotesPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(vote.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cuo.mutation.RemovedVotesIDs(); len(nodes) > 0 && !cuo.mutation.VotesCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   content.VotesTable,
			Columns: content.VotesPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(vote.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cuo.mutation.VotesIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   content.VotesTable,
			Columns: content.VotesPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(vote.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	if cuo.mutation.GroupsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   content.GroupsTable,
			Columns: content.GroupsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(group.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cuo.mutation.RemovedGroupsIDs(); len(nodes) > 0 && !cuo.mutation.GroupsCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   content.GroupsTable,
			Columns: content.GroupsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(group.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := cuo.mutation.GroupsIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: false,
			Table:   content.GroupsTable,
			Columns: content.GroupsPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(group.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges.Add = append(_spec.Edges.Add, edge)
	}
	_node = &Content{config: cuo.config}
	_spec.Assign = _node.assignValues
	_spec.ScanValues = _node.scanValues
	if err = sqlgraph.UpdateNode(ctx, cuo.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{content.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return nil, err
	}
	cuo.mutation.done = true
	return _node, nil
}
