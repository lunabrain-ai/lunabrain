package openai

import (
	"strings"
	"testing"
)

type ChunkerTest struct {
	content    string
	chunkSize  int
	chunkCount int
	sep        string
}

func TestChunker(t *testing.T) {
	tests := []ChunkerTest{
		{content: "This is a test", chunkSize: 5, chunkCount: 1, sep: " "},
		{content: "This is a test, This is a test", chunkSize: 5, chunkCount: 2, sep: " "},
	}
	chunker, err := NewChunker()
	if err != nil {
		t.Errorf("NewChunker() error = %v", err)
	}
	for _, tt := range tests {
		t.Run("chunking content", func(t *testing.T) {
			chunks, err := chunker.SplitText(tt.content, tt.chunkSize)
			if err != nil {
				t.Errorf("ChunkChatCtx() error = %v", err)
			}
			if len(chunks) != tt.chunkCount {
				t.Errorf("ChunkChatCtx() got = %v, want %v, chunks: %v", len(chunks), tt.chunkCount, chunks)
			}
			if strings.Join(chunks, tt.sep) != tt.content {
				t.Errorf("ChunkChatCtx() got = %v, want %v", strings.Join(chunks, ""), tt.content)
			}
		})
	}
}
