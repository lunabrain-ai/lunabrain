package content

import (
	"fmt"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/content"
	"strings"
	"testing"
)

func printTag(indent int, t *content.Tag) {
	fmt.Printf("%s- %s\n", strings.Repeat("  ", indent), t.Name)
	for _, subTag := range t.SubTags {
		printTag(indent+1, subTag)
	}
}

func TestService_GetTags(t *testing.T) {
	tags := []string{
		"tag/subtag",
		"tag",
		"tag/another/one",
		"technology/ai",
		"technology/ai/machine-learning",
		"technology/web/frontend",
		"technology/web/backend",
		"lifestyle/travel/europe",
		"lifestyle/travel/asia",
		"lifestyle/food",
		"science/astronomy",
		"science/biology/human",
		"science/biology/plants",
		"sports/soccer",
		"sports/basketball",
		"music/rock/classic",
		"music/jazz",
		"music/rock/alternative",
	}

	root := &content.Tag{Name: "root"}
	for _, tg := range tags {
		processTags(root, tg)
	}
	printTag(0, root)
}
