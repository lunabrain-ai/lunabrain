package schema

import (
	"github.com/lunabrain-ai/lunabrain/gen/content"
	"google.golang.org/protobuf/encoding/protojson"
)

// ContentEncoder give a generic data type for json encoded data.
type ContentEncoder struct {
	// TODO breadchris couldn't figure out how to make this generic, there is a problem with protojson.Unmarshal/Marshal
	*content.Content
}

func (c *ContentEncoder) MarshalJSON() ([]byte, error) {
	marshaler := &protojson.MarshalOptions{}
	b, err := marshaler.Marshal(c.Content)
	if err != nil {
		return nil, err
	}
	return b, nil
}

func (c *ContentEncoder) UnmarshalJSON(data []byte) error {
	unmarshaler := protojson.UnmarshalOptions{DiscardUnknown: true}

	if c.Content == nil {
		c.Content = &content.Content{}
	}

	if err := unmarshaler.Unmarshal(data, c.Content); err != nil {
		return err
	}
	return nil
}
