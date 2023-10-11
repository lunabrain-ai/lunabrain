package content

import (
	"math"
	"sort"
	"time"
)

type Item struct {
	ID       int
	Title    string
	Points   int       // number of upvotes
	PostTime time.Time // the time when the item was posted
}

// gravity determines the rate at which an article loses its appeal over time.
const gravity = 1.8

func rank(item Item, currentTime time.Time) float64 {
	hoursSincePosted := currentTime.Sub(item.PostTime).Hours()
	return float64(item.Points-1) / math.Pow(hoursSincePosted+2, gravity)
}

func sortByHNRanking(items []Item) {
	currentTime := time.Now()

	sort.SliceStable(items, func(i, j int) bool {
		return rank(items[i], currentTime) > rank(items[j], currentTime)
	})
}
