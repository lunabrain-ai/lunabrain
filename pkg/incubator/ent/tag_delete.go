// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/lunabrain-ai/lunabrain/pkg/incubator/ent/predicate"
	"github.com/lunabrain-ai/lunabrain/pkg/incubator/ent/tag"
)

// TagDelete is the builder for deleting a Tag entity.
type TagDelete struct {
	config
	hooks    []Hook
	mutation *TagMutation
}

// Where appends a list predicates to the TagDelete builder.
func (td *TagDelete) Where(ps ...predicate.Tag) *TagDelete {
	td.mutation.Where(ps...)
	return td
}

// Exec executes the deletion query and returns how many vertices were deleted.
func (td *TagDelete) Exec(ctx context.Context) (int, error) {
	return withHooks(ctx, td.sqlExec, td.mutation, td.hooks)
}

// ExecX is like Exec, but panics if an error occurs.
func (td *TagDelete) ExecX(ctx context.Context) int {
	n, err := td.Exec(ctx)
	if err != nil {
		panic(err)
	}
	return n
}

func (td *TagDelete) sqlExec(ctx context.Context) (int, error) {
	_spec := sqlgraph.NewDeleteSpec(tag.Table, sqlgraph.NewFieldSpec(tag.FieldID, field.TypeUUID))
	if ps := td.mutation.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	affected, err := sqlgraph.DeleteNodes(ctx, td.driver, _spec)
	if err != nil && sqlgraph.IsConstraintError(err) {
		err = &ConstraintError{msg: err.Error(), wrap: err}
	}
	td.mutation.done = true
	return affected, err
}

// TagDeleteOne is the builder for deleting a single Tag entity.
type TagDeleteOne struct {
	td *TagDelete
}

// Where appends a list predicates to the TagDelete builder.
func (tdo *TagDeleteOne) Where(ps ...predicate.Tag) *TagDeleteOne {
	tdo.td.mutation.Where(ps...)
	return tdo
}

// Exec executes the deletion query.
func (tdo *TagDeleteOne) Exec(ctx context.Context) error {
	n, err := tdo.td.Exec(ctx)
	switch {
	case err != nil:
		return err
	case n == 0:
		return &NotFoundError{tag.Label}
	default:
		return nil
	}
}

// ExecX is like Exec, but panics if an error occurs.
func (tdo *TagDeleteOne) ExecX(ctx context.Context) {
	if err := tdo.Exec(ctx); err != nil {
		panic(err)
	}
}
