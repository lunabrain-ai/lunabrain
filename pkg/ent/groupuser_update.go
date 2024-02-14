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
	"github.com/lunabrain-ai/lunabrain/pkg/ent/group"
	"github.com/lunabrain-ai/lunabrain/pkg/ent/groupuser"
	"github.com/lunabrain-ai/lunabrain/pkg/ent/predicate"
	entuser "github.com/lunabrain-ai/lunabrain/pkg/ent/user"
)

// GroupUserUpdate is the builder for updating GroupUser entities.
type GroupUserUpdate struct {
	config
	hooks    []Hook
	mutation *GroupUserMutation
}

// Where appends a list predicates to the GroupUserUpdate builder.
func (guu *GroupUserUpdate) Where(ps ...predicate.GroupUser) *GroupUserUpdate {
	guu.mutation.Where(ps...)
	return guu
}

// SetRole sets the "role" field.
func (guu *GroupUserUpdate) SetRole(s string) *GroupUserUpdate {
	guu.mutation.SetRole(s)
	return guu
}

// SetUserID sets the "user" edge to the User entity by ID.
func (guu *GroupUserUpdate) SetUserID(id uuid.UUID) *GroupUserUpdate {
	guu.mutation.SetUserID(id)
	return guu
}

// SetNillableUserID sets the "user" edge to the User entity by ID if the given value is not nil.
func (guu *GroupUserUpdate) SetNillableUserID(id *uuid.UUID) *GroupUserUpdate {
	if id != nil {
		guu = guu.SetUserID(*id)
	}
	return guu
}

// SetUser sets the "user" edge to the User entity.
func (guu *GroupUserUpdate) SetUser(u *User) *GroupUserUpdate {
	return guu.SetUserID(u.ID)
}

// SetGroupID sets the "group" edge to the Group entity by ID.
func (guu *GroupUserUpdate) SetGroupID(id uuid.UUID) *GroupUserUpdate {
	guu.mutation.SetGroupID(id)
	return guu
}

// SetNillableGroupID sets the "group" edge to the Group entity by ID if the given value is not nil.
func (guu *GroupUserUpdate) SetNillableGroupID(id *uuid.UUID) *GroupUserUpdate {
	if id != nil {
		guu = guu.SetGroupID(*id)
	}
	return guu
}

// SetGroup sets the "group" edge to the Group entity.
func (guu *GroupUserUpdate) SetGroup(g *Group) *GroupUserUpdate {
	return guu.SetGroupID(g.ID)
}

// Mutation returns the GroupUserMutation object of the builder.
func (guu *GroupUserUpdate) Mutation() *GroupUserMutation {
	return guu.mutation
}

// ClearUser clears the "user" edge to the User entity.
func (guu *GroupUserUpdate) ClearUser() *GroupUserUpdate {
	guu.mutation.ClearUser()
	return guu
}

// ClearGroup clears the "group" edge to the Group entity.
func (guu *GroupUserUpdate) ClearGroup() *GroupUserUpdate {
	guu.mutation.ClearGroup()
	return guu
}

// Save executes the query and returns the number of nodes affected by the update operation.
func (guu *GroupUserUpdate) Save(ctx context.Context) (int, error) {
	return withHooks(ctx, guu.sqlSave, guu.mutation, guu.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (guu *GroupUserUpdate) SaveX(ctx context.Context) int {
	affected, err := guu.Save(ctx)
	if err != nil {
		panic(err)
	}
	return affected
}

// Exec executes the query.
func (guu *GroupUserUpdate) Exec(ctx context.Context) error {
	_, err := guu.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (guu *GroupUserUpdate) ExecX(ctx context.Context) {
	if err := guu.Exec(ctx); err != nil {
		panic(err)
	}
}

func (guu *GroupUserUpdate) sqlSave(ctx context.Context) (n int, err error) {
	_spec := sqlgraph.NewUpdateSpec(groupuser.Table, groupuser.Columns, sqlgraph.NewFieldSpec(groupuser.FieldID, field.TypeUUID))
	if ps := guu.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := guu.mutation.Role(); ok {
		_spec.SetField(groupuser.FieldRole, field.TypeString, value)
	}
	if guu.mutation.UserCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   groupuser.UserTable,
			Columns: []string{groupuser.UserColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(entuser.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := guu.mutation.UserIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   groupuser.UserTable,
			Columns: []string{groupuser.UserColumn},
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
	if guu.mutation.GroupCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   groupuser.GroupTable,
			Columns: []string{groupuser.GroupColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(group.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := guu.mutation.GroupIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   groupuser.GroupTable,
			Columns: []string{groupuser.GroupColumn},
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
	if n, err = sqlgraph.UpdateNodes(ctx, guu.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{groupuser.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return 0, err
	}
	guu.mutation.done = true
	return n, nil
}

// GroupUserUpdateOne is the builder for updating a single GroupUser entity.
type GroupUserUpdateOne struct {
	config
	fields   []string
	hooks    []Hook
	mutation *GroupUserMutation
}

// SetRole sets the "role" field.
func (guuo *GroupUserUpdateOne) SetRole(s string) *GroupUserUpdateOne {
	guuo.mutation.SetRole(s)
	return guuo
}

// SetUserID sets the "user" edge to the User entity by ID.
func (guuo *GroupUserUpdateOne) SetUserID(id uuid.UUID) *GroupUserUpdateOne {
	guuo.mutation.SetUserID(id)
	return guuo
}

// SetNillableUserID sets the "user" edge to the User entity by ID if the given value is not nil.
func (guuo *GroupUserUpdateOne) SetNillableUserID(id *uuid.UUID) *GroupUserUpdateOne {
	if id != nil {
		guuo = guuo.SetUserID(*id)
	}
	return guuo
}

// SetUser sets the "user" edge to the User entity.
func (guuo *GroupUserUpdateOne) SetUser(u *User) *GroupUserUpdateOne {
	return guuo.SetUserID(u.ID)
}

// SetGroupID sets the "group" edge to the Group entity by ID.
func (guuo *GroupUserUpdateOne) SetGroupID(id uuid.UUID) *GroupUserUpdateOne {
	guuo.mutation.SetGroupID(id)
	return guuo
}

// SetNillableGroupID sets the "group" edge to the Group entity by ID if the given value is not nil.
func (guuo *GroupUserUpdateOne) SetNillableGroupID(id *uuid.UUID) *GroupUserUpdateOne {
	if id != nil {
		guuo = guuo.SetGroupID(*id)
	}
	return guuo
}

// SetGroup sets the "group" edge to the Group entity.
func (guuo *GroupUserUpdateOne) SetGroup(g *Group) *GroupUserUpdateOne {
	return guuo.SetGroupID(g.ID)
}

// Mutation returns the GroupUserMutation object of the builder.
func (guuo *GroupUserUpdateOne) Mutation() *GroupUserMutation {
	return guuo.mutation
}

// ClearUser clears the "user" edge to the User entity.
func (guuo *GroupUserUpdateOne) ClearUser() *GroupUserUpdateOne {
	guuo.mutation.ClearUser()
	return guuo
}

// ClearGroup clears the "group" edge to the Group entity.
func (guuo *GroupUserUpdateOne) ClearGroup() *GroupUserUpdateOne {
	guuo.mutation.ClearGroup()
	return guuo
}

// Where appends a list predicates to the GroupUserUpdate builder.
func (guuo *GroupUserUpdateOne) Where(ps ...predicate.GroupUser) *GroupUserUpdateOne {
	guuo.mutation.Where(ps...)
	return guuo
}

// Select allows selecting one or more fields (columns) of the returned entity.
// The default is selecting all fields defined in the entity schema.
func (guuo *GroupUserUpdateOne) Select(field string, fields ...string) *GroupUserUpdateOne {
	guuo.fields = append([]string{field}, fields...)
	return guuo
}

// Save executes the query and returns the updated GroupUser entity.
func (guuo *GroupUserUpdateOne) Save(ctx context.Context) (*GroupUser, error) {
	return withHooks(ctx, guuo.sqlSave, guuo.mutation, guuo.hooks)
}

// SaveX is like Save, but panics if an error occurs.
func (guuo *GroupUserUpdateOne) SaveX(ctx context.Context) *GroupUser {
	node, err := guuo.Save(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// Exec executes the query on the entity.
func (guuo *GroupUserUpdateOne) Exec(ctx context.Context) error {
	_, err := guuo.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (guuo *GroupUserUpdateOne) ExecX(ctx context.Context) {
	if err := guuo.Exec(ctx); err != nil {
		panic(err)
	}
}

func (guuo *GroupUserUpdateOne) sqlSave(ctx context.Context) (_node *GroupUser, err error) {
	_spec := sqlgraph.NewUpdateSpec(groupuser.Table, groupuser.Columns, sqlgraph.NewFieldSpec(groupuser.FieldID, field.TypeUUID))
	id, ok := guuo.mutation.ID()
	if !ok {
		return nil, &ValidationError{Name: "id", err: errors.New(`ent: missing "GroupUser.id" for update`)}
	}
	_spec.Node.ID.Value = id
	if fields := guuo.fields; len(fields) > 0 {
		_spec.Node.Columns = make([]string, 0, len(fields))
		_spec.Node.Columns = append(_spec.Node.Columns, groupuser.FieldID)
		for _, f := range fields {
			if !groupuser.ValidColumn(f) {
				return nil, &ValidationError{Name: f, err: fmt.Errorf("ent: invalid field %q for query", f)}
			}
			if f != groupuser.FieldID {
				_spec.Node.Columns = append(_spec.Node.Columns, f)
			}
		}
	}
	if ps := guuo.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if value, ok := guuo.mutation.Role(); ok {
		_spec.SetField(groupuser.FieldRole, field.TypeString, value)
	}
	if guuo.mutation.UserCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   groupuser.UserTable,
			Columns: []string{groupuser.UserColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(entuser.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := guuo.mutation.UserIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   groupuser.UserTable,
			Columns: []string{groupuser.UserColumn},
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
	if guuo.mutation.GroupCleared() {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   groupuser.GroupTable,
			Columns: []string{groupuser.GroupColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(group.FieldID, field.TypeUUID),
			},
		}
		_spec.Edges.Clear = append(_spec.Edges.Clear, edge)
	}
	if nodes := guuo.mutation.GroupIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   groupuser.GroupTable,
			Columns: []string{groupuser.GroupColumn},
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
	_node = &GroupUser{config: guuo.config}
	_spec.Assign = _node.assignValues
	_spec.ScanValues = _node.scanValues
	if err = sqlgraph.UpdateNode(ctx, guuo.driver, _spec); err != nil {
		if _, ok := err.(*sqlgraph.NotFoundError); ok {
			err = &NotFoundError{groupuser.Label}
		} else if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return nil, err
	}
	guuo.mutation.done = true
	return _node, nil
}
