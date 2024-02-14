package content

import (
	"github.com/google/uuid"
	"github.com/lunabrain-ai/lunabrain/pkg/gen/content"
)

func NewTextContent(uri, s string, tags []string) *content.Content {
	return &content.Content{
		Id:   uuid.NewString(),
		Uri:  uri,
		Tags: tags,
		Type: &content.Content_Data{
			Data: &content.Data{
				Type: &content.Data_Text{
					Text: &content.Text{
						Data: s,
					},
				},
			},
		},
	}
}
