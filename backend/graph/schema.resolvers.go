package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"database/sql"
	"fmt"
	"time"

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

	db, err := sql.Open("postgres", "postgres://postgres:secretpgpassword@localhost:5432/sifty?sslmode=disable")
	if err != nil {
		log.Error().
			Err(err).
			Str("url", input.URL).
			Msg("unable to open database connection")
		return nil, err
	}
	defer db.Close()

	insertBookmarkStmt := Bookmark.INSERT(
		Bookmark.URL,
		Bookmark.Title,
		Bookmark.Excerpt,
		Bookmark.Author,
		Bookmark.Public,
		Bookmark.Content,
		Bookmark.HTML,
		Bookmark.Modified,
	).ON_CONFLICT(Bookmark.URL).DO_UPDATE(pgjet.SET(
		Bookmark.URL.SET(pgjet.String(newBookmark.URL)),
		Bookmark.Title.SET(pgjet.String(newBookmark.Title)),
		Bookmark.Excerpt.SET(pgjet.String(newBookmark.Excerpt)),
		Bookmark.Author.SET(pgjet.String(newBookmark.Author)),
		Bookmark.Content.SET(pgjet.String(newBookmark.Content)),
		Bookmark.HTML.SET(pgjet.String(newBookmark.HTML)),
		Bookmark.Modified.SET(pgjet.TimestampT(time.Now())),
	)).VALUES(
		newBookmark.URL,
		newBookmark.Title,
		newBookmark.Excerpt,
		newBookmark.Author,
		newBookmark.Public,
		newBookmark.Content,
		newBookmark.HTML,
		time.Now(),
	)

	_, err = insertBookmarkStmt.ExecContext(ctx, db)
	if err != nil {
		log.Error().
			Err(err).
			Str("url", input.URL).
			Msg("unable to insert new bookmark")
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
