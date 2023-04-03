package transform

import "github.com/google/wire"

var ProviderSet = wire.NewSet(
	NewSummarize,
	NewCategorize,
	wire.Bind(new(Summarizer), new(*Summarize)),
	wire.Bind(new(Categorizer), new(*Categorize)),
)
