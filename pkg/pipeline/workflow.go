package pipeline

import "github.com/lunabrain-ai/lunabrain/pkg/store/db"

type Workflow struct {
	store db.Store
}

func (w Workflow) normalize(contentType string, data string) {
	switch contentType {
	case "audio":
	case "text":
	}
}

func (w Workflow) Run(contentType string, data string, metadata string) {
	// TODO: implement
	// The workflow should be:
	// 1. Receive content from the API
	// 2. Normalize the content
	// 3. Save the content to the database
	// 4. Return the ID of the audio
	w.normalize(contentType, data)
}

func NewWorkflow(store db.Store) *Workflow {
	return &Workflow{
		store: store,
	}
}
