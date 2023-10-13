package source

import "testing"

func TestNewLogSeq(t *testing.T) {
	l := NewLogSeq()
	l.Load("/Users/hacked/Documents/GitHub/notes/journals")

	// TODO breadchris filter by domain
}
