package server

import (
	"context"
	"errors"

	"gitea.com/go-chi/session"
)

// GetSession gets the session set by go chi session middleware.
func GetSession(ctx context.Context) session.Store {
	sessCtx := ctx.Value("Session")
	sess, _ := sessCtx.(session.Store)
	return sess
}

// SetUserForSession will set the user id in the session store located in the context.
func SetUserForSession(ctx context.Context, userID uint) {
	store := GetSession(ctx)
	store.Set("user", userID)
}

func RemoveUserFromSession(ctx context.Context) {
	store := GetSession(ctx)
	store.Delete("user")
}

// GetUserFromSession will get the user id from the session store located in the context.
func GetUserFromSession(ctx context.Context) (uint, error) {
	store := GetSession(ctx)
	userIDInterface := store.Get("user")
	userID, ok := userIDInterface.(uint)
	if !ok {
		return 0, errors.New("failed to get user id from session")
	}
	return userID, nil
}
