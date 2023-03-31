package db

import "testing"

func TestNewDB(t *testing.T) {
	db, err := NewDB(nil)
	if err != nil {
		t.Fatal(err)
	}
	var _ Store = db
}
