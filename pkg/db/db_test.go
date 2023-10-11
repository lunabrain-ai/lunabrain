package db

import "testing"

func TestNewDB(t *testing.T) {
	_, err := New(nil)
	if err != nil {
		t.Fatal(err)
	}
}
