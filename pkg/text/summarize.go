package text

import (
	"context"
	"github.com/breadchris/sifty/backend/gen"
	"github.com/breadchris/sifty/backend/pkg/ml"
	"os"
)

func Summarize(fileName string) (summary string, err error) {
	client, err := ml.NewPythonClient()
	if err != nil {
		return
	}

	content, err := os.ReadFile(fileName)
	if err != nil {
		return
	}

	resp, err := client.Summarize(context.Background(), &gen.SummarizeRequest{
		Content: string(content),
	})
	if err != nil {
		return
	}
	summary = resp.Summary
	return
}
