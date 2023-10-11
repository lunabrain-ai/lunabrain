package content

import (
	"fmt"
	"testing"
	"time"
)

func TestRank(t *testing.T) {
	items := []Item{
		{ID: 1, Title: "First Post", Points: 100, PostTime: time.Now().Add(-24 * time.Hour)},
		{ID: 2, Title: "Second Post", Points: 50, PostTime: time.Now().Add(-12 * time.Hour)},
		{ID: 3, Title: "Third Post", Points: 25, PostTime: time.Now()},
	}

	sortByHNRanking(items)

	for _, item := range items {
		fmt.Println(item.Title)
	}
}
