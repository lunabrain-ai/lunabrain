package index

import (
	"database/sql"

	"github.com/PullRequestInc/go-gpt3"
)

type QuestionAnswerer interface {
	AnswerQuestionFromContent(prompt, question string, content []string) (string, error)
	SearchForReferences(vulnID, search, question string) (string, error)
	GenerateEmbeddingForRef(
		ref *ReferenceContent,
		refEmbeddingExists RefEmbeddingExistsFunc,
		insertRefEmbedding InsertRefEmbeddingFunc,
	) error
}

type service struct {
	DB           *sql.DB
	OpenAIClient gpt3.Client
}

func NewService(db *sql.DB, openAI gpt3.Client) (*service, error) {
	return &service{
		DB:           db,
		OpenAIClient: openAI,
	}, nil
}
