// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"errors"
	"fmt"

	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/pkg/incubator/ent/group"
	"github.com/lunabrain-ai/lunabrain/pkg/incubator/ent/groupinvite"
)

// GroupInviteCreate is the builder for creating a GroupInvite entity.
type GroupInviteCreate struct {
	config
	mutation *GroupInviteMutation
	hooks    []Hook
}

// SetSecret sets the "secret" field.
func (gic *GroupInviteCreate) SetSecret(s string) *GroupInviteCreate {
	gic.mutation.SetSecret(s)
	return gic
}

// SetGroupID sets the "group" edge to the Group entity by ID.
func (gic *GroupInviteCreate) SetGroupID(id uuid.UUID) *GroupInviteCreate {
	gic.mutation.SetGroupID(id)
	return gic
}

// SetNillableGroupID sets the "group" edge to the Group entity by ID if the given value is not nil.
func (gic *GroupInviteCreate) SetNillableGroupID(id *uuid.UUID) *GroupInviteCreate {
	if id != nil {
		gic = gic.SetGroupID(*id)
	}
	return gic
}

// SetGroup sets the "group" edge to the Group entity.
func (gic *GroupInviteCreate) SetGroup(g *Group) *GroupInviteCreate {
	return gic.SetGroupID(g.ID)
}

// Mutation returns the GroupInviteMutation object of the builder.
func (gic *GroupInviteCreate) Mutation() *GroupInviteMutation {
	return gic.mutation
}

// Save creates the GroupInvite in the database.
func (gic *GroupInviteCreate) Save(ctx context.Context) (*GroupInvite, error) {
	return withHooks(ctx, gic.sqlSave, gic.mutation, gic.hooks)
}

// SaveX calls Save and panics if Save returns an error.
func (gic *GroupInviteCreate) SaveX(ctx context.Context) *GroupInvite {
	v, err := gic.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (gic *GroupInviteCreate) Exec(ctx context.Context) error {
	_, err := gic.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (gic *GroupInviteCreate) ExecX(ctx context.Context) {
	if err := gic.Exec(ctx); err != nil {
		panic(err)
	}
}

// check runs all checks and user-defined validators on the builder.
func (gic *GroupInviteCreate) check() error {
	if _, ok := gic.mutation.Secret(); !ok {
		return &ValidationError{Name: "secret", err: errors.New(`ent: missing required field "GroupInvite.secret"`)}
	}
	return nil
}

func (gic *GroupInviteCreate) sqlSave(ctx context.Context) (*GroupInvite, error) {
	if err := gic.check(); err != nil {
		return nil, err
	}
	_node, _spec := gic.createSpec()
	if err := sqlgraph.CreateNode(ctx, gic.driver, _spec); err != nil {
		if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return nil, err
	}
	id := _spec.ID.Value.(int64)
	_node.ID = int(id)
	gic.mutation.id = &_node.ID
	gic.mutation.done = true
	return _node, nil
}

func (gic *GroupInviteCreate) createSpec() (*GroupInvite, *sqlgraph.CreateSpec) {
	var (
		_node = &GroupInvite{config: gic.config}
		_spec = sqlgraph.NewCreateSpec(groupinvite.Table, sqlgraph.NewFieldSpec(groupinvite.FieldID, field.TypeInt))
	)
	if value, ok := gic.mutation.Secret(); ok {
		_spec.SetField(groupinvite.FieldSecret, field.TypeString, value)
		_node.Secret = value
	}
	if nodes := gic.mutation.GroupIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   groupinvite.GroupTable,
			Columns: []string{groupinvite.GroupColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(group.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_node.group_invites = &nodes[0]
		_spec.Edges = append(_spec.Edges, edge)
	}
	return _node, _spec
}

// GroupInviteCreateBulk is the builder for creating many GroupInvite entities in bulk.
type GroupInviteCreateBulk struct {
	config
	err      error
	builders []*GroupInviteCreate
}

// Save creates the GroupInvite entities in the database.
func (gicb *GroupInviteCreateBulk) Save(ctx context.Context) ([]*GroupInvite, error) {
	if gicb.err != nil {
		return nil, gicb.err
	}
	specs := make([]*sqlgraph.CreateSpec, len(gicb.builders))
	nodes := make([]*GroupInvite, len(gicb.builders))
	mutators := make([]Mutator, len(gicb.builders))
	for i := range gicb.builders {
		func(i int, root context.Context) {
			builder := gicb.builders[i]
			var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
				mutation, ok := m.(*GroupInviteMutation)
				if !ok {
					return nil, fmt.Errorf("unexpected mutation type %T", m)
				}
				if err := builder.check(); err != nil {
					return nil, err
				}
				builder.mutation = mutation
				var err error
				nodes[i], specs[i] = builder.createSpec()
				if i < len(mutators)-1 {
					_, err = mutators[i+1].Mutate(root, gicb.builders[i+1].mutation)
				} else {
					spec := &sqlgraph.BatchCreateSpec{Nodes: specs}
					// Invoke the actual operation on the latest mutation in the chain.
					if err = sqlgraph.BatchCreate(ctx, gicb.driver, spec); err != nil {
						if sqlgraph.IsConstraintError(err) {
							err = &ConstraintError{msg: err.Error(), wrap: err}
						}
					}
				}
				if err != nil {
					return nil, err
				}
				mutation.id = &nodes[i].ID
				if specs[i].ID.Value != nil {
					id := specs[i].ID.Value.(int64)
					nodes[i].ID = int(id)
				}
				mutation.done = true
				return nodes[i], nil
			})
			for i := len(builder.hooks) - 1; i >= 0; i-- {
				mut = builder.hooks[i](mut)
			}
			mutators[i] = mut
		}(i, ctx)
	}
	if len(mutators) > 0 {
		if _, err := mutators[0].Mutate(ctx, gicb.builders[0].mutation); err != nil {
			return nil, err
		}
	}
	return nodes, nil
}

// SaveX is like Save, but panics if an error occurs.
func (gicb *GroupInviteCreateBulk) SaveX(ctx context.Context) []*GroupInvite {
	v, err := gicb.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (gicb *GroupInviteCreateBulk) Exec(ctx context.Context) error {
	_, err := gicb.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (gicb *GroupInviteCreateBulk) ExecX(ctx context.Context) {
	if err := gicb.Exec(ctx); err != nil {
		panic(err)
	}
}
