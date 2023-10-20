// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"fmt"

	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/pkg/incubator/ent/content"
	entuser "github.com/lunabrain-ai/lunabrain/pkg/incubator/ent/user"
	"github.com/lunabrain-ai/lunabrain/pkg/incubator/ent/vote"
)

// VoteCreate is the builder for creating a Vote entity.
type VoteCreate struct {
	config
	mutation *VoteMutation
	hooks    []Hook
}

// SetID sets the "id" field.
func (vc *VoteCreate) SetID(u uuid.UUID) *VoteCreate {
	vc.mutation.SetID(u)
	return vc
}

// SetNillableID sets the "id" field if the given value is not nil.
func (vc *VoteCreate) SetNillableID(u *uuid.UUID) *VoteCreate {
	if u != nil {
		vc.SetID(*u)
	}
	return vc
}

// AddContentIDs adds the "content" edge to the Content entity by IDs.
func (vc *VoteCreate) AddContentIDs(ids ...uuid.UUID) *VoteCreate {
	vc.mutation.AddContentIDs(ids...)
	return vc
}

// AddContent adds the "content" edges to the Content entity.
func (vc *VoteCreate) AddContent(c ...*Content) *VoteCreate {
	ids := make([]uuid.UUID, len(c))
	for i := range c {
		ids[i] = c[i].ID
	}
	return vc.AddContentIDs(ids...)
}

// SetUserID sets the "user" edge to the User entity by ID.
func (vc *VoteCreate) SetUserID(id uuid.UUID) *VoteCreate {
	vc.mutation.SetUserID(id)
	return vc
}

// SetNillableUserID sets the "user" edge to the User entity by ID if the given value is not nil.
func (vc *VoteCreate) SetNillableUserID(id *uuid.UUID) *VoteCreate {
	if id != nil {
		vc = vc.SetUserID(*id)
	}
	return vc
}

// SetUser sets the "user" edge to the User entity.
func (vc *VoteCreate) SetUser(u *User) *VoteCreate {
	return vc.SetUserID(u.ID)
}

// Mutation returns the VoteMutation object of the builder.
func (vc *VoteCreate) Mutation() *VoteMutation {
	return vc.mutation
}

// Save creates the Vote in the database.
func (vc *VoteCreate) Save(ctx context.Context) (*Vote, error) {
	vc.defaults()
	return withHooks(ctx, vc.sqlSave, vc.mutation, vc.hooks)
}

// SaveX calls Save and panics if Save returns an error.
func (vc *VoteCreate) SaveX(ctx context.Context) *Vote {
	v, err := vc.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (vc *VoteCreate) Exec(ctx context.Context) error {
	_, err := vc.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (vc *VoteCreate) ExecX(ctx context.Context) {
	if err := vc.Exec(ctx); err != nil {
		panic(err)
	}
}

// defaults sets the default values of the builder before save.
func (vc *VoteCreate) defaults() {
	if _, ok := vc.mutation.ID(); !ok {
		v := vote.DefaultID()
		vc.mutation.SetID(v)
	}
}

// check runs all checks and user-defined validators on the builder.
func (vc *VoteCreate) check() error {
	return nil
}

func (vc *VoteCreate) sqlSave(ctx context.Context) (*Vote, error) {
	if err := vc.check(); err != nil {
		return nil, err
	}
	_node, _spec := vc.createSpec()
	if err := sqlgraph.CreateNode(ctx, vc.driver, _spec); err != nil {
		if sqlgraph.IsConstraintError(err) {
			err = &ConstraintError{msg: err.Error(), wrap: err}
		}
		return nil, err
	}
	if _spec.ID.Value != nil {
		if id, ok := _spec.ID.Value.(*uuid.UUID); ok {
			_node.ID = *id
		} else if err := _node.ID.Scan(_spec.ID.Value); err != nil {
			return nil, err
		}
	}
	vc.mutation.id = &_node.ID
	vc.mutation.done = true
	return _node, nil
}

func (vc *VoteCreate) createSpec() (*Vote, *sqlgraph.CreateSpec) {
	var (
		_node = &Vote{config: vc.config}
		_spec = sqlgraph.NewCreateSpec(vote.Table, sqlgraph.NewFieldSpec(vote.FieldID, field.TypeUUID))
	)
	if id, ok := vc.mutation.ID(); ok {
		_node.ID = id
		_spec.ID.Value = &id
	}
	if nodes := vc.mutation.ContentIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2M,
			Inverse: true,
			Table:   vote.ContentTable,
			Columns: vote.ContentPrimaryKey,
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(content.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_spec.Edges = append(_spec.Edges, edge)
	}
	if nodes := vc.mutation.UserIDs(); len(nodes) > 0 {
		edge := &sqlgraph.EdgeSpec{
			Rel:     sqlgraph.M2O,
			Inverse: true,
			Table:   vote.UserTable,
			Columns: []string{vote.UserColumn},
			Bidi:    false,
			Target: &sqlgraph.EdgeTarget{
				IDSpec: sqlgraph.NewFieldSpec(entuser.FieldID, field.TypeUUID),
			},
		}
		for _, k := range nodes {
			edge.Target.Nodes = append(edge.Target.Nodes, k)
		}
		_node.user_votes = &nodes[0]
		_spec.Edges = append(_spec.Edges, edge)
	}
	return _node, _spec
}

// VoteCreateBulk is the builder for creating many Vote entities in bulk.
type VoteCreateBulk struct {
	config
	err      error
	builders []*VoteCreate
}

// Save creates the Vote entities in the database.
func (vcb *VoteCreateBulk) Save(ctx context.Context) ([]*Vote, error) {
	if vcb.err != nil {
		return nil, vcb.err
	}
	specs := make([]*sqlgraph.CreateSpec, len(vcb.builders))
	nodes := make([]*Vote, len(vcb.builders))
	mutators := make([]Mutator, len(vcb.builders))
	for i := range vcb.builders {
		func(i int, root context.Context) {
			builder := vcb.builders[i]
			builder.defaults()
			var mut Mutator = MutateFunc(func(ctx context.Context, m Mutation) (Value, error) {
				mutation, ok := m.(*VoteMutation)
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
					_, err = mutators[i+1].Mutate(root, vcb.builders[i+1].mutation)
				} else {
					spec := &sqlgraph.BatchCreateSpec{Nodes: specs}
					// Invoke the actual operation on the latest mutation in the chain.
					if err = sqlgraph.BatchCreate(ctx, vcb.driver, spec); err != nil {
						if sqlgraph.IsConstraintError(err) {
							err = &ConstraintError{msg: err.Error(), wrap: err}
						}
					}
				}
				if err != nil {
					return nil, err
				}
				mutation.id = &nodes[i].ID
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
		if _, err := mutators[0].Mutate(ctx, vcb.builders[0].mutation); err != nil {
			return nil, err
		}
	}
	return nodes, nil
}

// SaveX is like Save, but panics if an error occurs.
func (vcb *VoteCreateBulk) SaveX(ctx context.Context) []*Vote {
	v, err := vcb.Save(ctx)
	if err != nil {
		panic(err)
	}
	return v
}

// Exec executes the query.
func (vcb *VoteCreateBulk) Exec(ctx context.Context) error {
	_, err := vcb.Save(ctx)
	return err
}

// ExecX is like Exec, but panics if an error occurs.
func (vcb *VoteCreateBulk) ExecX(ctx context.Context) {
	if err := vcb.Exec(ctx); err != nil {
		panic(err)
	}
}
