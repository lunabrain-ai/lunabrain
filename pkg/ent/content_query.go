// Code generated by ent, DO NOT EDIT.

package ent

import (
	"context"
	"database/sql/driver"
	"fmt"
	"math"

	"entgo.io/ent/dialect/sql"
	"entgo.io/ent/dialect/sql/sqlgraph"
	"entgo.io/ent/schema/field"
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/pkg/ent/content"
	"github.com/lunabrain-ai/lunabrain/pkg/ent/group"
	"github.com/lunabrain-ai/lunabrain/pkg/ent/predicate"
	"github.com/lunabrain-ai/lunabrain/pkg/ent/tag"
	entuser "github.com/lunabrain-ai/lunabrain/pkg/ent/user"
)

// ContentQuery is the builder for querying Content entities.
type ContentQuery struct {
	config
	ctx          *QueryContext
	order        []content.OrderOption
	inters       []Interceptor
	predicates   []predicate.Content
	withUser     *UserQuery
	withTags     *TagQuery
	withChildren *ContentQuery
	withParents  *ContentQuery
	withGroups   *GroupQuery
	withFKs      bool
	// intermediate query (i.e. traversal path).
	sql  *sql.Selector
	path func(context.Context) (*sql.Selector, error)
}

// Where adds a new predicate for the ContentQuery builder.
func (cq *ContentQuery) Where(ps ...predicate.Content) *ContentQuery {
	cq.predicates = append(cq.predicates, ps...)
	return cq
}

// Limit the number of records to be returned by this query.
func (cq *ContentQuery) Limit(limit int) *ContentQuery {
	cq.ctx.Limit = &limit
	return cq
}

// Offset to start from.
func (cq *ContentQuery) Offset(offset int) *ContentQuery {
	cq.ctx.Offset = &offset
	return cq
}

// Unique configures the query builder to filter duplicate records on query.
// By default, unique is set to true, and can be disabled using this method.
func (cq *ContentQuery) Unique(unique bool) *ContentQuery {
	cq.ctx.Unique = &unique
	return cq
}

// Order specifies how the records should be ordered.
func (cq *ContentQuery) Order(o ...content.OrderOption) *ContentQuery {
	cq.order = append(cq.order, o...)
	return cq
}

// QueryUser chains the current query on the "user" edge.
func (cq *ContentQuery) QueryUser() *UserQuery {
	query := (&UserClient{config: cq.config}).Query()
	query.path = func(ctx context.Context) (fromU *sql.Selector, err error) {
		if err := cq.prepareQuery(ctx); err != nil {
			return nil, err
		}
		selector := cq.sqlQuery(ctx)
		if err := selector.Err(); err != nil {
			return nil, err
		}
		step := sqlgraph.NewStep(
			sqlgraph.From(content.Table, content.FieldID, selector),
			sqlgraph.To(entuser.Table, entuser.FieldID),
			sqlgraph.Edge(sqlgraph.M2O, true, content.UserTable, content.UserColumn),
		)
		fromU = sqlgraph.SetNeighbors(cq.driver.Dialect(), step)
		return fromU, nil
	}
	return query
}

// QueryTags chains the current query on the "tags" edge.
func (cq *ContentQuery) QueryTags() *TagQuery {
	query := (&TagClient{config: cq.config}).Query()
	query.path = func(ctx context.Context) (fromU *sql.Selector, err error) {
		if err := cq.prepareQuery(ctx); err != nil {
			return nil, err
		}
		selector := cq.sqlQuery(ctx)
		if err := selector.Err(); err != nil {
			return nil, err
		}
		step := sqlgraph.NewStep(
			sqlgraph.From(content.Table, content.FieldID, selector),
			sqlgraph.To(tag.Table, tag.FieldID),
			sqlgraph.Edge(sqlgraph.M2M, true, content.TagsTable, content.TagsPrimaryKey...),
		)
		fromU = sqlgraph.SetNeighbors(cq.driver.Dialect(), step)
		return fromU, nil
	}
	return query
}

// QueryChildren chains the current query on the "children" edge.
func (cq *ContentQuery) QueryChildren() *ContentQuery {
	query := (&ContentClient{config: cq.config}).Query()
	query.path = func(ctx context.Context) (fromU *sql.Selector, err error) {
		if err := cq.prepareQuery(ctx); err != nil {
			return nil, err
		}
		selector := cq.sqlQuery(ctx)
		if err := selector.Err(); err != nil {
			return nil, err
		}
		step := sqlgraph.NewStep(
			sqlgraph.From(content.Table, content.FieldID, selector),
			sqlgraph.To(content.Table, content.FieldID),
			sqlgraph.Edge(sqlgraph.M2M, false, content.ChildrenTable, content.ChildrenPrimaryKey...),
		)
		fromU = sqlgraph.SetNeighbors(cq.driver.Dialect(), step)
		return fromU, nil
	}
	return query
}

// QueryParents chains the current query on the "parents" edge.
func (cq *ContentQuery) QueryParents() *ContentQuery {
	query := (&ContentClient{config: cq.config}).Query()
	query.path = func(ctx context.Context) (fromU *sql.Selector, err error) {
		if err := cq.prepareQuery(ctx); err != nil {
			return nil, err
		}
		selector := cq.sqlQuery(ctx)
		if err := selector.Err(); err != nil {
			return nil, err
		}
		step := sqlgraph.NewStep(
			sqlgraph.From(content.Table, content.FieldID, selector),
			sqlgraph.To(content.Table, content.FieldID),
			sqlgraph.Edge(sqlgraph.M2M, true, content.ParentsTable, content.ParentsPrimaryKey...),
		)
		fromU = sqlgraph.SetNeighbors(cq.driver.Dialect(), step)
		return fromU, nil
	}
	return query
}

// QueryGroups chains the current query on the "groups" edge.
func (cq *ContentQuery) QueryGroups() *GroupQuery {
	query := (&GroupClient{config: cq.config}).Query()
	query.path = func(ctx context.Context) (fromU *sql.Selector, err error) {
		if err := cq.prepareQuery(ctx); err != nil {
			return nil, err
		}
		selector := cq.sqlQuery(ctx)
		if err := selector.Err(); err != nil {
			return nil, err
		}
		step := sqlgraph.NewStep(
			sqlgraph.From(content.Table, content.FieldID, selector),
			sqlgraph.To(group.Table, group.FieldID),
			sqlgraph.Edge(sqlgraph.M2M, false, content.GroupsTable, content.GroupsPrimaryKey...),
		)
		fromU = sqlgraph.SetNeighbors(cq.driver.Dialect(), step)
		return fromU, nil
	}
	return query
}

// First returns the first Content entity from the query.
// Returns a *NotFoundError when no Content was found.
func (cq *ContentQuery) First(ctx context.Context) (*Content, error) {
	nodes, err := cq.Limit(1).All(setContextOp(ctx, cq.ctx, "First"))
	if err != nil {
		return nil, err
	}
	if len(nodes) == 0 {
		return nil, &NotFoundError{content.Label}
	}
	return nodes[0], nil
}

// FirstX is like First, but panics if an error occurs.
func (cq *ContentQuery) FirstX(ctx context.Context) *Content {
	node, err := cq.First(ctx)
	if err != nil && !IsNotFound(err) {
		panic(err)
	}
	return node
}

// FirstID returns the first Content ID from the query.
// Returns a *NotFoundError when no Content ID was found.
func (cq *ContentQuery) FirstID(ctx context.Context) (id uuid.UUID, err error) {
	var ids []uuid.UUID
	if ids, err = cq.Limit(1).IDs(setContextOp(ctx, cq.ctx, "FirstID")); err != nil {
		return
	}
	if len(ids) == 0 {
		err = &NotFoundError{content.Label}
		return
	}
	return ids[0], nil
}

// FirstIDX is like FirstID, but panics if an error occurs.
func (cq *ContentQuery) FirstIDX(ctx context.Context) uuid.UUID {
	id, err := cq.FirstID(ctx)
	if err != nil && !IsNotFound(err) {
		panic(err)
	}
	return id
}

// Only returns a single Content entity found by the query, ensuring it only returns one.
// Returns a *NotSingularError when more than one Content entity is found.
// Returns a *NotFoundError when no Content entities are found.
func (cq *ContentQuery) Only(ctx context.Context) (*Content, error) {
	nodes, err := cq.Limit(2).All(setContextOp(ctx, cq.ctx, "Only"))
	if err != nil {
		return nil, err
	}
	switch len(nodes) {
	case 1:
		return nodes[0], nil
	case 0:
		return nil, &NotFoundError{content.Label}
	default:
		return nil, &NotSingularError{content.Label}
	}
}

// OnlyX is like Only, but panics if an error occurs.
func (cq *ContentQuery) OnlyX(ctx context.Context) *Content {
	node, err := cq.Only(ctx)
	if err != nil {
		panic(err)
	}
	return node
}

// OnlyID is like Only, but returns the only Content ID in the query.
// Returns a *NotSingularError when more than one Content ID is found.
// Returns a *NotFoundError when no entities are found.
func (cq *ContentQuery) OnlyID(ctx context.Context) (id uuid.UUID, err error) {
	var ids []uuid.UUID
	if ids, err = cq.Limit(2).IDs(setContextOp(ctx, cq.ctx, "OnlyID")); err != nil {
		return
	}
	switch len(ids) {
	case 1:
		id = ids[0]
	case 0:
		err = &NotFoundError{content.Label}
	default:
		err = &NotSingularError{content.Label}
	}
	return
}

// OnlyIDX is like OnlyID, but panics if an error occurs.
func (cq *ContentQuery) OnlyIDX(ctx context.Context) uuid.UUID {
	id, err := cq.OnlyID(ctx)
	if err != nil {
		panic(err)
	}
	return id
}

// All executes the query and returns a list of Contents.
func (cq *ContentQuery) All(ctx context.Context) ([]*Content, error) {
	ctx = setContextOp(ctx, cq.ctx, "All")
	if err := cq.prepareQuery(ctx); err != nil {
		return nil, err
	}
	qr := querierAll[[]*Content, *ContentQuery]()
	return withInterceptors[[]*Content](ctx, cq, qr, cq.inters)
}

// AllX is like All, but panics if an error occurs.
func (cq *ContentQuery) AllX(ctx context.Context) []*Content {
	nodes, err := cq.All(ctx)
	if err != nil {
		panic(err)
	}
	return nodes
}

// IDs executes the query and returns a list of Content IDs.
func (cq *ContentQuery) IDs(ctx context.Context) (ids []uuid.UUID, err error) {
	if cq.ctx.Unique == nil && cq.path != nil {
		cq.Unique(true)
	}
	ctx = setContextOp(ctx, cq.ctx, "IDs")
	if err = cq.Select(content.FieldID).Scan(ctx, &ids); err != nil {
		return nil, err
	}
	return ids, nil
}

// IDsX is like IDs, but panics if an error occurs.
func (cq *ContentQuery) IDsX(ctx context.Context) []uuid.UUID {
	ids, err := cq.IDs(ctx)
	if err != nil {
		panic(err)
	}
	return ids
}

// Count returns the count of the given query.
func (cq *ContentQuery) Count(ctx context.Context) (int, error) {
	ctx = setContextOp(ctx, cq.ctx, "Count")
	if err := cq.prepareQuery(ctx); err != nil {
		return 0, err
	}
	return withInterceptors[int](ctx, cq, querierCount[*ContentQuery](), cq.inters)
}

// CountX is like Count, but panics if an error occurs.
func (cq *ContentQuery) CountX(ctx context.Context) int {
	count, err := cq.Count(ctx)
	if err != nil {
		panic(err)
	}
	return count
}

// Exist returns true if the query has elements in the graph.
func (cq *ContentQuery) Exist(ctx context.Context) (bool, error) {
	ctx = setContextOp(ctx, cq.ctx, "Exist")
	switch _, err := cq.FirstID(ctx); {
	case IsNotFound(err):
		return false, nil
	case err != nil:
		return false, fmt.Errorf("ent: check existence: %w", err)
	default:
		return true, nil
	}
}

// ExistX is like Exist, but panics if an error occurs.
func (cq *ContentQuery) ExistX(ctx context.Context) bool {
	exist, err := cq.Exist(ctx)
	if err != nil {
		panic(err)
	}
	return exist
}

// Clone returns a duplicate of the ContentQuery builder, including all associated steps. It can be
// used to prepare common query builders and use them differently after the clone is made.
func (cq *ContentQuery) Clone() *ContentQuery {
	if cq == nil {
		return nil
	}
	return &ContentQuery{
		config:       cq.config,
		ctx:          cq.ctx.Clone(),
		order:        append([]content.OrderOption{}, cq.order...),
		inters:       append([]Interceptor{}, cq.inters...),
		predicates:   append([]predicate.Content{}, cq.predicates...),
		withUser:     cq.withUser.Clone(),
		withTags:     cq.withTags.Clone(),
		withChildren: cq.withChildren.Clone(),
		withParents:  cq.withParents.Clone(),
		withGroups:   cq.withGroups.Clone(),
		// clone intermediate query.
		sql:  cq.sql.Clone(),
		path: cq.path,
	}
}

// WithUser tells the query-builder to eager-load the nodes that are connected to
// the "user" edge. The optional arguments are used to configure the query builder of the edge.
func (cq *ContentQuery) WithUser(opts ...func(*UserQuery)) *ContentQuery {
	query := (&UserClient{config: cq.config}).Query()
	for _, opt := range opts {
		opt(query)
	}
	cq.withUser = query
	return cq
}

// WithTags tells the query-builder to eager-load the nodes that are connected to
// the "tags" edge. The optional arguments are used to configure the query builder of the edge.
func (cq *ContentQuery) WithTags(opts ...func(*TagQuery)) *ContentQuery {
	query := (&TagClient{config: cq.config}).Query()
	for _, opt := range opts {
		opt(query)
	}
	cq.withTags = query
	return cq
}

// WithChildren tells the query-builder to eager-load the nodes that are connected to
// the "children" edge. The optional arguments are used to configure the query builder of the edge.
func (cq *ContentQuery) WithChildren(opts ...func(*ContentQuery)) *ContentQuery {
	query := (&ContentClient{config: cq.config}).Query()
	for _, opt := range opts {
		opt(query)
	}
	cq.withChildren = query
	return cq
}

// WithParents tells the query-builder to eager-load the nodes that are connected to
// the "parents" edge. The optional arguments are used to configure the query builder of the edge.
func (cq *ContentQuery) WithParents(opts ...func(*ContentQuery)) *ContentQuery {
	query := (&ContentClient{config: cq.config}).Query()
	for _, opt := range opts {
		opt(query)
	}
	cq.withParents = query
	return cq
}

// WithGroups tells the query-builder to eager-load the nodes that are connected to
// the "groups" edge. The optional arguments are used to configure the query builder of the edge.
func (cq *ContentQuery) WithGroups(opts ...func(*GroupQuery)) *ContentQuery {
	query := (&GroupClient{config: cq.config}).Query()
	for _, opt := range opts {
		opt(query)
	}
	cq.withGroups = query
	return cq
}

// GroupBy is used to group vertices by one or more fields/columns.
// It is often used with aggregate functions, like: count, max, mean, min, sum.
//
// Example:
//
//	var v []struct {
//		Root bool `json:"root,omitempty"`
//		Count int `json:"count,omitempty"`
//	}
//
//	client.Content.Query().
//		GroupBy(content.FieldRoot).
//		Aggregate(ent.Count()).
//		Scan(ctx, &v)
func (cq *ContentQuery) GroupBy(field string, fields ...string) *ContentGroupBy {
	cq.ctx.Fields = append([]string{field}, fields...)
	grbuild := &ContentGroupBy{build: cq}
	grbuild.flds = &cq.ctx.Fields
	grbuild.label = content.Label
	grbuild.scan = grbuild.Scan
	return grbuild
}

// Select allows the selection one or more fields/columns for the given query,
// instead of selecting all fields in the entity.
//
// Example:
//
//	var v []struct {
//		Root bool `json:"root,omitempty"`
//	}
//
//	client.Content.Query().
//		Select(content.FieldRoot).
//		Scan(ctx, &v)
func (cq *ContentQuery) Select(fields ...string) *ContentSelect {
	cq.ctx.Fields = append(cq.ctx.Fields, fields...)
	sbuild := &ContentSelect{ContentQuery: cq}
	sbuild.label = content.Label
	sbuild.flds, sbuild.scan = &cq.ctx.Fields, sbuild.Scan
	return sbuild
}

// Aggregate returns a ContentSelect configured with the given aggregations.
func (cq *ContentQuery) Aggregate(fns ...AggregateFunc) *ContentSelect {
	return cq.Select().Aggregate(fns...)
}

func (cq *ContentQuery) prepareQuery(ctx context.Context) error {
	for _, inter := range cq.inters {
		if inter == nil {
			return fmt.Errorf("ent: uninitialized interceptor (forgotten import ent/runtime?)")
		}
		if trv, ok := inter.(Traverser); ok {
			if err := trv.Traverse(ctx, cq); err != nil {
				return err
			}
		}
	}
	for _, f := range cq.ctx.Fields {
		if !content.ValidColumn(f) {
			return &ValidationError{Name: f, err: fmt.Errorf("ent: invalid field %q for query", f)}
		}
	}
	if cq.path != nil {
		prev, err := cq.path(ctx)
		if err != nil {
			return err
		}
		cq.sql = prev
	}
	return nil
}

func (cq *ContentQuery) sqlAll(ctx context.Context, hooks ...queryHook) ([]*Content, error) {
	var (
		nodes       = []*Content{}
		withFKs     = cq.withFKs
		_spec       = cq.querySpec()
		loadedTypes = [5]bool{
			cq.withUser != nil,
			cq.withTags != nil,
			cq.withChildren != nil,
			cq.withParents != nil,
			cq.withGroups != nil,
		}
	)
	if cq.withUser != nil {
		withFKs = true
	}
	if withFKs {
		_spec.Node.Columns = append(_spec.Node.Columns, content.ForeignKeys...)
	}
	_spec.ScanValues = func(columns []string) ([]any, error) {
		return (*Content).scanValues(nil, columns)
	}
	_spec.Assign = func(columns []string, values []any) error {
		node := &Content{config: cq.config}
		nodes = append(nodes, node)
		node.Edges.loadedTypes = loadedTypes
		return node.assignValues(columns, values)
	}
	for i := range hooks {
		hooks[i](ctx, _spec)
	}
	if err := sqlgraph.QueryNodes(ctx, cq.driver, _spec); err != nil {
		return nil, err
	}
	if len(nodes) == 0 {
		return nodes, nil
	}
	if query := cq.withUser; query != nil {
		if err := cq.loadUser(ctx, query, nodes, nil,
			func(n *Content, e *User) { n.Edges.User = e }); err != nil {
			return nil, err
		}
	}
	if query := cq.withTags; query != nil {
		if err := cq.loadTags(ctx, query, nodes,
			func(n *Content) { n.Edges.Tags = []*Tag{} },
			func(n *Content, e *Tag) { n.Edges.Tags = append(n.Edges.Tags, e) }); err != nil {
			return nil, err
		}
	}
	if query := cq.withChildren; query != nil {
		if err := cq.loadChildren(ctx, query, nodes,
			func(n *Content) { n.Edges.Children = []*Content{} },
			func(n *Content, e *Content) { n.Edges.Children = append(n.Edges.Children, e) }); err != nil {
			return nil, err
		}
	}
	if query := cq.withParents; query != nil {
		if err := cq.loadParents(ctx, query, nodes,
			func(n *Content) { n.Edges.Parents = []*Content{} },
			func(n *Content, e *Content) { n.Edges.Parents = append(n.Edges.Parents, e) }); err != nil {
			return nil, err
		}
	}
	if query := cq.withGroups; query != nil {
		if err := cq.loadGroups(ctx, query, nodes,
			func(n *Content) { n.Edges.Groups = []*Group{} },
			func(n *Content, e *Group) { n.Edges.Groups = append(n.Edges.Groups, e) }); err != nil {
			return nil, err
		}
	}
	return nodes, nil
}

func (cq *ContentQuery) loadUser(ctx context.Context, query *UserQuery, nodes []*Content, init func(*Content), assign func(*Content, *User)) error {
	ids := make([]uuid.UUID, 0, len(nodes))
	nodeids := make(map[uuid.UUID][]*Content)
	for i := range nodes {
		if nodes[i].user_content == nil {
			continue
		}
		fk := *nodes[i].user_content
		if _, ok := nodeids[fk]; !ok {
			ids = append(ids, fk)
		}
		nodeids[fk] = append(nodeids[fk], nodes[i])
	}
	if len(ids) == 0 {
		return nil
	}
	query.Where(entuser.IDIn(ids...))
	neighbors, err := query.All(ctx)
	if err != nil {
		return err
	}
	for _, n := range neighbors {
		nodes, ok := nodeids[n.ID]
		if !ok {
			return fmt.Errorf(`unexpected foreign-key "user_content" returned %v`, n.ID)
		}
		for i := range nodes {
			assign(nodes[i], n)
		}
	}
	return nil
}
func (cq *ContentQuery) loadTags(ctx context.Context, query *TagQuery, nodes []*Content, init func(*Content), assign func(*Content, *Tag)) error {
	edgeIDs := make([]driver.Value, len(nodes))
	byID := make(map[uuid.UUID]*Content)
	nids := make(map[uuid.UUID]map[*Content]struct{})
	for i, node := range nodes {
		edgeIDs[i] = node.ID
		byID[node.ID] = node
		if init != nil {
			init(node)
		}
	}
	query.Where(func(s *sql.Selector) {
		joinT := sql.Table(content.TagsTable)
		s.Join(joinT).On(s.C(tag.FieldID), joinT.C(content.TagsPrimaryKey[0]))
		s.Where(sql.InValues(joinT.C(content.TagsPrimaryKey[1]), edgeIDs...))
		columns := s.SelectedColumns()
		s.Select(joinT.C(content.TagsPrimaryKey[1]))
		s.AppendSelect(columns...)
		s.SetDistinct(false)
	})
	if err := query.prepareQuery(ctx); err != nil {
		return err
	}
	qr := QuerierFunc(func(ctx context.Context, q Query) (Value, error) {
		return query.sqlAll(ctx, func(_ context.Context, spec *sqlgraph.QuerySpec) {
			assign := spec.Assign
			values := spec.ScanValues
			spec.ScanValues = func(columns []string) ([]any, error) {
				values, err := values(columns[1:])
				if err != nil {
					return nil, err
				}
				return append([]any{new(uuid.UUID)}, values...), nil
			}
			spec.Assign = func(columns []string, values []any) error {
				outValue := *values[0].(*uuid.UUID)
				inValue := *values[1].(*uuid.UUID)
				if nids[inValue] == nil {
					nids[inValue] = map[*Content]struct{}{byID[outValue]: {}}
					return assign(columns[1:], values[1:])
				}
				nids[inValue][byID[outValue]] = struct{}{}
				return nil
			}
		})
	})
	neighbors, err := withInterceptors[[]*Tag](ctx, query, qr, query.inters)
	if err != nil {
		return err
	}
	for _, n := range neighbors {
		nodes, ok := nids[n.ID]
		if !ok {
			return fmt.Errorf(`unexpected "tags" node returned %v`, n.ID)
		}
		for kn := range nodes {
			assign(kn, n)
		}
	}
	return nil
}
func (cq *ContentQuery) loadChildren(ctx context.Context, query *ContentQuery, nodes []*Content, init func(*Content), assign func(*Content, *Content)) error {
	edgeIDs := make([]driver.Value, len(nodes))
	byID := make(map[uuid.UUID]*Content)
	nids := make(map[uuid.UUID]map[*Content]struct{})
	for i, node := range nodes {
		edgeIDs[i] = node.ID
		byID[node.ID] = node
		if init != nil {
			init(node)
		}
	}
	query.Where(func(s *sql.Selector) {
		joinT := sql.Table(content.ChildrenTable)
		s.Join(joinT).On(s.C(content.FieldID), joinT.C(content.ChildrenPrimaryKey[1]))
		s.Where(sql.InValues(joinT.C(content.ChildrenPrimaryKey[0]), edgeIDs...))
		columns := s.SelectedColumns()
		s.Select(joinT.C(content.ChildrenPrimaryKey[0]))
		s.AppendSelect(columns...)
		s.SetDistinct(false)
	})
	if err := query.prepareQuery(ctx); err != nil {
		return err
	}
	qr := QuerierFunc(func(ctx context.Context, q Query) (Value, error) {
		return query.sqlAll(ctx, func(_ context.Context, spec *sqlgraph.QuerySpec) {
			assign := spec.Assign
			values := spec.ScanValues
			spec.ScanValues = func(columns []string) ([]any, error) {
				values, err := values(columns[1:])
				if err != nil {
					return nil, err
				}
				return append([]any{new(uuid.UUID)}, values...), nil
			}
			spec.Assign = func(columns []string, values []any) error {
				outValue := *values[0].(*uuid.UUID)
				inValue := *values[1].(*uuid.UUID)
				if nids[inValue] == nil {
					nids[inValue] = map[*Content]struct{}{byID[outValue]: {}}
					return assign(columns[1:], values[1:])
				}
				nids[inValue][byID[outValue]] = struct{}{}
				return nil
			}
		})
	})
	neighbors, err := withInterceptors[[]*Content](ctx, query, qr, query.inters)
	if err != nil {
		return err
	}
	for _, n := range neighbors {
		nodes, ok := nids[n.ID]
		if !ok {
			return fmt.Errorf(`unexpected "children" node returned %v`, n.ID)
		}
		for kn := range nodes {
			assign(kn, n)
		}
	}
	return nil
}
func (cq *ContentQuery) loadParents(ctx context.Context, query *ContentQuery, nodes []*Content, init func(*Content), assign func(*Content, *Content)) error {
	edgeIDs := make([]driver.Value, len(nodes))
	byID := make(map[uuid.UUID]*Content)
	nids := make(map[uuid.UUID]map[*Content]struct{})
	for i, node := range nodes {
		edgeIDs[i] = node.ID
		byID[node.ID] = node
		if init != nil {
			init(node)
		}
	}
	query.Where(func(s *sql.Selector) {
		joinT := sql.Table(content.ParentsTable)
		s.Join(joinT).On(s.C(content.FieldID), joinT.C(content.ParentsPrimaryKey[0]))
		s.Where(sql.InValues(joinT.C(content.ParentsPrimaryKey[1]), edgeIDs...))
		columns := s.SelectedColumns()
		s.Select(joinT.C(content.ParentsPrimaryKey[1]))
		s.AppendSelect(columns...)
		s.SetDistinct(false)
	})
	if err := query.prepareQuery(ctx); err != nil {
		return err
	}
	qr := QuerierFunc(func(ctx context.Context, q Query) (Value, error) {
		return query.sqlAll(ctx, func(_ context.Context, spec *sqlgraph.QuerySpec) {
			assign := spec.Assign
			values := spec.ScanValues
			spec.ScanValues = func(columns []string) ([]any, error) {
				values, err := values(columns[1:])
				if err != nil {
					return nil, err
				}
				return append([]any{new(uuid.UUID)}, values...), nil
			}
			spec.Assign = func(columns []string, values []any) error {
				outValue := *values[0].(*uuid.UUID)
				inValue := *values[1].(*uuid.UUID)
				if nids[inValue] == nil {
					nids[inValue] = map[*Content]struct{}{byID[outValue]: {}}
					return assign(columns[1:], values[1:])
				}
				nids[inValue][byID[outValue]] = struct{}{}
				return nil
			}
		})
	})
	neighbors, err := withInterceptors[[]*Content](ctx, query, qr, query.inters)
	if err != nil {
		return err
	}
	for _, n := range neighbors {
		nodes, ok := nids[n.ID]
		if !ok {
			return fmt.Errorf(`unexpected "parents" node returned %v`, n.ID)
		}
		for kn := range nodes {
			assign(kn, n)
		}
	}
	return nil
}
func (cq *ContentQuery) loadGroups(ctx context.Context, query *GroupQuery, nodes []*Content, init func(*Content), assign func(*Content, *Group)) error {
	edgeIDs := make([]driver.Value, len(nodes))
	byID := make(map[uuid.UUID]*Content)
	nids := make(map[uuid.UUID]map[*Content]struct{})
	for i, node := range nodes {
		edgeIDs[i] = node.ID
		byID[node.ID] = node
		if init != nil {
			init(node)
		}
	}
	query.Where(func(s *sql.Selector) {
		joinT := sql.Table(content.GroupsTable)
		s.Join(joinT).On(s.C(group.FieldID), joinT.C(content.GroupsPrimaryKey[1]))
		s.Where(sql.InValues(joinT.C(content.GroupsPrimaryKey[0]), edgeIDs...))
		columns := s.SelectedColumns()
		s.Select(joinT.C(content.GroupsPrimaryKey[0]))
		s.AppendSelect(columns...)
		s.SetDistinct(false)
	})
	if err := query.prepareQuery(ctx); err != nil {
		return err
	}
	qr := QuerierFunc(func(ctx context.Context, q Query) (Value, error) {
		return query.sqlAll(ctx, func(_ context.Context, spec *sqlgraph.QuerySpec) {
			assign := spec.Assign
			values := spec.ScanValues
			spec.ScanValues = func(columns []string) ([]any, error) {
				values, err := values(columns[1:])
				if err != nil {
					return nil, err
				}
				return append([]any{new(uuid.UUID)}, values...), nil
			}
			spec.Assign = func(columns []string, values []any) error {
				outValue := *values[0].(*uuid.UUID)
				inValue := *values[1].(*uuid.UUID)
				if nids[inValue] == nil {
					nids[inValue] = map[*Content]struct{}{byID[outValue]: {}}
					return assign(columns[1:], values[1:])
				}
				nids[inValue][byID[outValue]] = struct{}{}
				return nil
			}
		})
	})
	neighbors, err := withInterceptors[[]*Group](ctx, query, qr, query.inters)
	if err != nil {
		return err
	}
	for _, n := range neighbors {
		nodes, ok := nids[n.ID]
		if !ok {
			return fmt.Errorf(`unexpected "groups" node returned %v`, n.ID)
		}
		for kn := range nodes {
			assign(kn, n)
		}
	}
	return nil
}

func (cq *ContentQuery) sqlCount(ctx context.Context) (int, error) {
	_spec := cq.querySpec()
	_spec.Node.Columns = cq.ctx.Fields
	if len(cq.ctx.Fields) > 0 {
		_spec.Unique = cq.ctx.Unique != nil && *cq.ctx.Unique
	}
	return sqlgraph.CountNodes(ctx, cq.driver, _spec)
}

func (cq *ContentQuery) querySpec() *sqlgraph.QuerySpec {
	_spec := sqlgraph.NewQuerySpec(content.Table, content.Columns, sqlgraph.NewFieldSpec(content.FieldID, field.TypeUUID))
	_spec.From = cq.sql
	if unique := cq.ctx.Unique; unique != nil {
		_spec.Unique = *unique
	} else if cq.path != nil {
		_spec.Unique = true
	}
	if fields := cq.ctx.Fields; len(fields) > 0 {
		_spec.Node.Columns = make([]string, 0, len(fields))
		_spec.Node.Columns = append(_spec.Node.Columns, content.FieldID)
		for i := range fields {
			if fields[i] != content.FieldID {
				_spec.Node.Columns = append(_spec.Node.Columns, fields[i])
			}
		}
	}
	if ps := cq.predicates; len(ps) > 0 {
		_spec.Predicate = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	if limit := cq.ctx.Limit; limit != nil {
		_spec.Limit = *limit
	}
	if offset := cq.ctx.Offset; offset != nil {
		_spec.Offset = *offset
	}
	if ps := cq.order; len(ps) > 0 {
		_spec.Order = func(selector *sql.Selector) {
			for i := range ps {
				ps[i](selector)
			}
		}
	}
	return _spec
}

func (cq *ContentQuery) sqlQuery(ctx context.Context) *sql.Selector {
	builder := sql.Dialect(cq.driver.Dialect())
	t1 := builder.Table(content.Table)
	columns := cq.ctx.Fields
	if len(columns) == 0 {
		columns = content.Columns
	}
	selector := builder.Select(t1.Columns(columns...)...).From(t1)
	if cq.sql != nil {
		selector = cq.sql
		selector.Select(selector.Columns(columns...)...)
	}
	if cq.ctx.Unique != nil && *cq.ctx.Unique {
		selector.Distinct()
	}
	for _, p := range cq.predicates {
		p(selector)
	}
	for _, p := range cq.order {
		p(selector)
	}
	if offset := cq.ctx.Offset; offset != nil {
		// limit is mandatory for offset clause. We start
		// with default value, and override it below if needed.
		selector.Offset(*offset).Limit(math.MaxInt32)
	}
	if limit := cq.ctx.Limit; limit != nil {
		selector.Limit(*limit)
	}
	return selector
}

// ContentGroupBy is the group-by builder for Content entities.
type ContentGroupBy struct {
	selector
	build *ContentQuery
}

// Aggregate adds the given aggregation functions to the group-by query.
func (cgb *ContentGroupBy) Aggregate(fns ...AggregateFunc) *ContentGroupBy {
	cgb.fns = append(cgb.fns, fns...)
	return cgb
}

// Scan applies the selector query and scans the result into the given value.
func (cgb *ContentGroupBy) Scan(ctx context.Context, v any) error {
	ctx = setContextOp(ctx, cgb.build.ctx, "GroupBy")
	if err := cgb.build.prepareQuery(ctx); err != nil {
		return err
	}
	return scanWithInterceptors[*ContentQuery, *ContentGroupBy](ctx, cgb.build, cgb, cgb.build.inters, v)
}

func (cgb *ContentGroupBy) sqlScan(ctx context.Context, root *ContentQuery, v any) error {
	selector := root.sqlQuery(ctx).Select()
	aggregation := make([]string, 0, len(cgb.fns))
	for _, fn := range cgb.fns {
		aggregation = append(aggregation, fn(selector))
	}
	if len(selector.SelectedColumns()) == 0 {
		columns := make([]string, 0, len(*cgb.flds)+len(cgb.fns))
		for _, f := range *cgb.flds {
			columns = append(columns, selector.C(f))
		}
		columns = append(columns, aggregation...)
		selector.Select(columns...)
	}
	selector.GroupBy(selector.Columns(*cgb.flds...)...)
	if err := selector.Err(); err != nil {
		return err
	}
	rows := &sql.Rows{}
	query, args := selector.Query()
	if err := cgb.build.driver.Query(ctx, query, args, rows); err != nil {
		return err
	}
	defer rows.Close()
	return sql.ScanSlice(rows, v)
}

// ContentSelect is the builder for selecting fields of Content entities.
type ContentSelect struct {
	*ContentQuery
	selector
}

// Aggregate adds the given aggregation functions to the selector query.
func (cs *ContentSelect) Aggregate(fns ...AggregateFunc) *ContentSelect {
	cs.fns = append(cs.fns, fns...)
	return cs
}

// Scan applies the selector query and scans the result into the given value.
func (cs *ContentSelect) Scan(ctx context.Context, v any) error {
	ctx = setContextOp(ctx, cs.ctx, "Select")
	if err := cs.prepareQuery(ctx); err != nil {
		return err
	}
	return scanWithInterceptors[*ContentQuery, *ContentSelect](ctx, cs.ContentQuery, cs, cs.inters, v)
}

func (cs *ContentSelect) sqlScan(ctx context.Context, root *ContentQuery, v any) error {
	selector := root.sqlQuery(ctx)
	aggregation := make([]string, 0, len(cs.fns))
	for _, fn := range cs.fns {
		aggregation = append(aggregation, fn(selector))
	}
	switch n := len(*cs.selector.flds); {
	case n == 0 && len(aggregation) > 0:
		selector.Select(aggregation...)
	case n != 0 && len(aggregation) > 0:
		selector.AppendSelect(aggregation...)
	}
	rows := &sql.Rows{}
	query, args := selector.Query()
	if err := cs.driver.Query(ctx, query, args, rows); err != nil {
		return err
	}
	defer rows.Close()
	return sql.ScanSlice(rows, v)
}
