package content

import (
	"github.com/lunabrain-ai/lunabrain/pkg/gen/content"
	"strings"
)

func processTags(root *content.Tag, tagStr string) {
	parts := strings.Split(tagStr, "/")
	current := root
	for _, part := range parts {
		found := false
		for _, subTag := range current.SubTags {
			if subTag.Name == part {
				current = subTag
				found = true
				break
			}
		}
		if !found {
			newTag := &content.Tag{Name: part}
			current.SubTags = append(current.SubTags, newTag)
			current = newTag
		}
	}
}
