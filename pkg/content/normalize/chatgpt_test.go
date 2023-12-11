package normalize

import (
	"encoding/json"
	"github.com/lunabrain-ai/lunabrain/pkg/bucket"
	"testing"
)

func TestChatGpt(t *testing.T) {
	n := New(bucket.NewTestBuilder())
	d, err := n.chatgpt("https://chat.openai.com/share/5e7e7375-331e-45e5-9fb1-2c50dd0e3f92")
	if err != nil {
		t.Fatal(err)
	}
	b, err := json.Marshal(d)
	if err != nil {
		t.Fatal(err)
	}
	t.Log(string(b))
}

func TestChatGptContent(t *testing.T) {
	n := New(bucket.NewTestBuilder())
	_, err := n.chatgptContent("https://chat.openai.com/share/5e7e7375-331e-45e5-9fb1-2c50dd0e3f92")
	if err != nil {
		t.Fatal(err)
	}
}
