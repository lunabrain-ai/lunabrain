package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"github.com/breadchris/sifty/backend/graph/middleware"
	"time"

	dbmodel "github.com/breadchris/sifty/backend/.gen/sifty/public/model"
	. "github.com/breadchris/sifty/backend/.gen/sifty/public/table"
	"github.com/breadchris/sifty/backend/graph/generated"
	"github.com/breadchris/sifty/backend/graph/model"
	"github.com/breadchris/sifty/backend/internal/bookmarks"
	bookmarkmodel "github.com/breadchris/sifty/backend/internal/model"
	pgjet "github.com/go-jet/jet/v2/postgres"
	_ "github.com/lib/pq"
	"github.com/rs/zerolog/log"
)

func (r *mutationResolver) SaveBookmark(ctx context.Context, input model.NewBookmark) (*model.SavedBookmark, error) {
	userId, err := middleware.UserIdFromContext(ctx)
	if err != nil {
		return nil, err
	}

	db, err := middleware.DBFromContext(ctx)
	if err != nil {
		return nil, err
	}

	bookmark := &bookmarkmodel.Bookmark{
		// TODO (cthompson) replace this with a slug
		ID:            1,
		URL:           input.URL,
		CreateArchive: true,
	}

	newBookmark, err := bookmarks.Download(bookmark, "/tmp")
	if err != nil {
		log.Error().
			Err(err).
			Str("url", input.URL).
			Msg("unable to create new bookmark")
		return nil, err
	}

	insertBookmarkStmt := Bookmarks.INSERT(
		Bookmarks.URL,
		Bookmarks.Title,
		Bookmarks.Excerpt,
		Bookmarks.Author,
		Bookmarks.Public,
		Bookmarks.Content,
		Bookmarks.HTML,
		Bookmarks.Modified,
	).ON_CONFLICT(Bookmarks.URL).DO_UPDATE(pgjet.SET(
		Bookmarks.URL.SET(pgjet.String(newBookmark.URL)),
		Bookmarks.Title.SET(pgjet.String(newBookmark.Title)),
		Bookmarks.Excerpt.SET(pgjet.String(newBookmark.Excerpt)),
		Bookmarks.Author.SET(pgjet.String(newBookmark.Author)),
		Bookmarks.Content.SET(pgjet.String(newBookmark.Content)),
		Bookmarks.HTML.SET(pgjet.String(newBookmark.HTML)),
		Bookmarks.Modified.SET(pgjet.TimestampT(time.Now())),
	)).VALUES(
		newBookmark.URL,
		newBookmark.Title,
		newBookmark.Excerpt,
		newBookmark.Author,
		newBookmark.Public,
		newBookmark.Content,
		newBookmark.HTML,
		time.Now(),
	).RETURNING(Bookmarks.ID)

	var createdBookmark dbmodel.Bookmarks

	err = insertBookmarkStmt.QueryContext(ctx, db, &createdBookmark)
	if err != nil {
		log.Error().
			Err(err).
			Str("url", input.URL).
			Msg("unable to insert new bookmark")
		return nil, err
	}

	insertUserBookmarkStmt := UserBookmarks.INSERT(
		UserBookmarks.UserID,
		UserBookmarks.BookmarkID,
	).VALUES(
		userId,
		createdBookmark.ID.String(),
	)

	_, err = insertUserBookmarkStmt.ExecContext(ctx, db)
	if err != nil {
		log.Error().
			Err(err).
			Str("url", input.URL).
			Msg("unable to insert new user bookmark")
		return nil, err
	}

	return &model.SavedBookmark{
		Title: newBookmark.Title,
		URL:   input.URL,
	}, nil
}

func (r *queryResolver) BookmarkQuery(ctx context.Context, q *model.BookmarkQueryRequest) (*model.BookmarkQueryResponse, error) {
	panic(fmt.Errorf("not implemented"))
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
