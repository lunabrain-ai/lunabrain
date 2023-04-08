package dsl

import "go.temporal.io/sdk/workflow"

type (
	WorkflowMetadata struct {
		ProjectID   string
		S3LogBucket string
		AccountID   string
	}
	// Workflow contains a root statement which is the entrypoint for execution.
	// A cron schedule can be specified to trigger this workflow on a specified cadence.
	Workflow struct {
		WorkflowMetadata
		Root         Statement
		CronSchedule string
		InputData    string
	}

	// Statement is either a collection of statements or an executable activity.
	Statement struct {
		ExecutionSequence  *ExecutionSequence
		BlockActivity      *BlockActivity
		IncomingTransition TransitionType
	}

	// ExecutionSequence executes statements in the specified execution sequence type order.
	ExecutionSequence struct {
		Elements []*Statement
		Type     ExecutionSequenceType
	}

	// BlockActivity is a computational unit with a resource identifier and activity type.
	BlockActivity struct {
		ResourceID string
		Type       AwsBlockType
	}

	// BlockInput holds the input data to a block.
	BlockInput struct {
		Data     string
		Backpack string
	}

	// Holds exceptions passed into BlockInput.Data for exception transitions
	ExceptionTextInput struct {
		ExceptionText string `json:"exception_text"`
	}

	// BlockResult contains the returned data from a BlockActivity and the type of block executed.
	BlockResult struct {
		Data          string
		ErrorText     string
		Backpack      string
		BlockType     AwsBlockType
		IsError       bool
		ExceptionText string
	}

	BlockActivityLogParams struct {
		ProjectID   string
		S3LogBucket string
	}

	BlockActivityParams struct {
		BlockActivityLogParams
		BlockInput
		AccountID  string
		ResourceID string
	}

	executable interface {
		execute(ctx workflow.Context, input BlockInput) (*BlockResult, error)
	}
)
