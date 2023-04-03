package scrape

import "github.com/google/wire"

var ProviderSet = wire.NewSet(
	NewConfig,
	NewCrawler,
	NewScraper,

	wire.Bind(new(Scraper), new(*scraper)),
	wire.Bind(new(Crawler), new(*crawler)),
)
