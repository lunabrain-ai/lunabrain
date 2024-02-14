package http

import (
	"context"
	"github.com/justshare-io/justshare/pkg/ent"
	"github.com/justshare-io/justshare/pkg/ent/session"
	"log/slog"
	"time"

	_ "github.com/mattn/go-sqlite3"
)

// EntStore represents the session store using entgo.
type EntStore struct {
	client      *ent.Client
	stopCleanup chan bool
}

// NewEntStore returns a new EntStore instance, with a background cleanup goroutine
// that runs every 5 minutes to remove expired session data.
func NewEntStore(client *ent.Client) (*EntStore, error) {
	store := &EntStore{client: client}
	go store.startCleanup(5 * time.Minute)
	return store, nil
}

// Find returns the data for a given session token from the EntStore instance.
func (e *EntStore) Find(token string) ([]byte, bool, error) {
	ctx := context.TODO()
	s, err := e.client.Session.Query().Where(session.TokenEQ(token), session.ExpiryGTE(time.Now())).Only(ctx)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, false, nil
		}
		return nil, false, err
	}
	return s.Data, true, nil
}

// Commit adds a session token and data to the EntStore instance with the
// given expiry time. If the session token already exists, then the data and expiry
// time are updated.
func (e *EntStore) Commit(token string, data []byte, expiry time.Time) error {
	ctx := context.TODO()
	_, err := e.client.Session.
		Create().
		SetToken(token).
		SetData(data).
		SetExpiry(expiry).
		Save(ctx)

	if ent.IsConstraintError(err) {
		// If there's a constraint error (i.e., the session already exists), update the existing session.
		_, err = e.client.Session.
			Update().
			Where(session.TokenEQ(token)).
			SetData(data).
			SetExpiry(expiry).
			Save(ctx)
	}

	return err
}

// Delete removes a session token and corresponding data from the EntStore instance.
func (e *EntStore) Delete(token string) error {
	ctx := context.TODO()
	_, err := e.client.Session.Delete().Where(session.TokenEQ(token)).Exec(ctx)
	return err
}

func (e *EntStore) startCleanup(interval time.Duration) {
	e.stopCleanup = make(chan bool)
	ticker := time.NewTicker(interval)
	for {
		select {
		case <-ticker.C:
			err := e.deleteExpired(context.Background())
			if err != nil {
				slog.Error("failed to delete expired sessions", "error", err)
			}
		case <-e.stopCleanup:
			ticker.Stop()
			return
		}
	}
}

func (e *EntStore) StopCleanup() {
	if e.stopCleanup != nil {
		e.stopCleanup <- true
	}
}

func (e *EntStore) deleteExpired(ctx context.Context) error {
	_, err := e.client.Session.Delete().Where(session.ExpiryLT(time.Now())).Exec(ctx)
	return err
}
