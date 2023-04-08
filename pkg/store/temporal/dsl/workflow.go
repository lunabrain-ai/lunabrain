package dsl

import (
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"go.temporal.io/sdk/workflow"
)

// SimpleDSLWorkflow workflow definition
func SimpleDSLWorkflow(ctx workflow.Context, dslWorkflow Workflow) (string, error) {
	ao := workflow.ActivityOptions{
		ScheduleToStartTimeout: time.Minute,
		StartToCloseTimeout:    time.Minute,
		HeartbeatTimeout:       time.Second * 20,
	}
	ctx = workflow.WithActivityOptions(ctx, ao)
	logger := workflow.GetLogger(ctx)

	inputData := "{}"
	if len(dslWorkflow.InputData) > 0 {
		inputData = dslWorkflow.InputData
	}

	blockInput := BlockInput{
		Data:     inputData,
		Backpack: "{}",
	}

	ctx = workflow.WithValue(ctx, AccountIDContextKey, dslWorkflow.AccountID)
	ctx = workflow.WithValue(ctx, ProjectIDContextKey, dslWorkflow.ProjectID)
	ctx = workflow.WithValue(ctx, S3LogBucketContextKey, dslWorkflow.S3LogBucket)

	resp, err := dslWorkflow.Root.execute(ctx, blockInput)
	if err != nil {
		logger.Error("DSL Workflow failed.", "Error", err)
		return "", err
	} else if resp == nil {
		return "", nil
	}

	logger.Info("DSL Workflow completed.")

	return resp.Data, err
}

func (b *Statement) execute(ctx workflow.Context, input BlockInput) (*BlockResult, error) {
	var resp *BlockResult
	var err error

	if b.ExecutionSequence != nil {
		resp, err = b.ExecutionSequence.execute(ctx, input)
		if err != nil {
			return nil, err
		}
	}
	if b.BlockActivity != nil {
		resp, err = b.BlockActivity.execute(ctx, input)
		if err != nil {
			return nil, err
		}
	}
	return resp, nil
}

func (a BlockActivity) execute(ctx workflow.Context, input BlockInput) (*BlockResult, error) {
	var err error

	if a.Type == AwsApiGatewayResponseBlockType {
		return &BlockResult{
			Data:      input.Data,
			Backpack:  input.Backpack,
			BlockType: AwsApiGatewayResponseBlockType,
		}, nil
	}

	blockActivityParams := BlockActivityParams{
		BlockActivityLogParams: BlockActivityLogParams{
			ProjectID:   ctx.Value(ProjectIDContextKey).(string),
			S3LogBucket: ctx.Value(S3LogBucketContextKey).(string),
		},
		BlockInput: BlockInput{
			Data:     input.Data,
			Backpack: input.Backpack,
		},
		AccountID:  ctx.Value(AccountIDContextKey).(string),
		ResourceID: a.ResourceID,
	}

	blockActivityNameLookup := map[AwsBlockType]AwsBlockActivityType{
		AwsLambdaBlockType: AwsLambdaActivityName,
		AwsTopicBlockType:  AwsPushToTopicActivityName,
		AwsQueueBlockType:  AwsPushToQueueActivityName,
	}

	activityName, ok := blockActivityNameLookup[a.Type]
	if !ok {
		return nil, fmt.Errorf("unable to find activity for type: %s", a.Type)
	}

	var blockResult BlockResult
	err = workflow.ExecuteActivity(ctx, string(activityName), blockActivityParams).Get(ctx, &blockResult)
	if err != nil {
		return nil, err
	}
	return &blockResult, nil
}

func (s ExecutionSequence) execute(ctx workflow.Context, input BlockInput) (*BlockResult, error) {
	switch s.Type {
	case Sequence:
		return s.executeInSequence(ctx, input)
	case Parallel:
		return s.executeInParallel(ctx, input)
	default:
		return nil, fmt.Errorf("unsupported execution sequence type: %s", s.Type)
	}
}

func (s ExecutionSequence) executeTransition(ctx workflow.Context, stmt *Statement, in *BlockResult) (out *BlockResult, err error) {
	blockInput := BlockInput{Backpack: in.Backpack}

	switch transition := stmt.IncomingTransition; transition {
	case ThenTransitionType:
		if in.IsError {
			return nil, nil
		}

		blockInput.Data = in.Data
		out, err = stmt.execute(ctx, blockInput)
	case ExceptionTransitionType:
		if in.IsError {
			exceptionText := ExceptionTextInput{ExceptionText: in.ErrorText}
			b, err := json.Marshal(exceptionText)

			if err != nil {
				return out, err
			}
			blockInput.Data = string(b)
			out, err = stmt.execute(ctx, blockInput)
		}
	default:
		err = fmt.Errorf("Incorrect transition type %s", stmt.IncomingTransition)
	}

	return out, err
}

func (s ExecutionSequence) executeInSequence(ctx workflow.Context, input BlockInput) (*BlockResult, error) {
	var err error

	blockResult := &BlockResult{
		Data:      input.Data,
		Backpack:  input.Backpack,
		BlockType: AwsLambdaBlockType,
	}

	for _, a := range s.Elements {
		blockResult, err = s.executeTransition(ctx, a, blockResult)

		if err != nil {
			return nil, err
		} else if blockResult == nil {
			return nil, nil
		}
	}
	return blockResult, nil
}

func (s ExecutionSequence) executeInParallel(ctx workflow.Context, input BlockInput) (*BlockResult, error) {
	// TODO figure out how to handle parallel invocations
	// Behavior should be different if we have merge transitions

	//
	// You can use the context passed in to activity as a way to cancel the activity like standard GO way.
	// Cancelling a parent context will cancel all the derived contexts as well.
	//

	// In the parallel block, we want to execute all of them in parallel and wait for all of them.
	// if one activity fails then we want to cancel all the rest of them as well.
	childCtx, cancelHandler := workflow.WithCancel(ctx)
	selector := workflow.NewSelector(ctx)
	pendingFutures := []workflow.Future{}

	var activityErr error
	var apiResponseResult *BlockResult

	var resultsMutex sync.Mutex
	results := []string{}

	for _, s := range s.Elements {
		f := executeAsync(s, childCtx, input)
		selector.AddFuture(f, func(f workflow.Future) {
			var result *BlockResult
			err := f.Get(ctx, &result)
			if err != nil {
				// cancel all pending activities
				cancelHandler()
				activityErr = err
				return
			}

			if result == nil {
				return
			}

			if result.BlockType == AwsApiGatewayResponseBlockType {
				apiResponseResult = result
			}

			resultsMutex.Lock()
			defer resultsMutex.Unlock()
			results = append(results, result.Data)
		})
		pendingFutures = append(pendingFutures, f)
	}

	for i := 0; i < len(s.Elements); i++ {
		selector.Select(ctx) // this will wait for one branch
		if activityErr != nil {
			return nil, activityErr
		}
	}

	if apiResponseResult != nil {
		return apiResponseResult, nil
	}

	resp, err := json.Marshal(results)
	if err != nil {
		return nil, err
	}

	blockResult := &BlockResult{
		Data: string(resp),
		// Parallel blocks modifying the backpack would result in undefine behavior,
		// so we are keeping the original backpack intact.
		Backpack:  input.Backpack,
		BlockType: AwsLambdaBlockType,
	}
	return blockResult, nil
}

func executeAsync(exe executable, ctx workflow.Context, input BlockInput) workflow.Future {
	future, settable := workflow.NewFuture(ctx)
	workflow.Go(ctx, func(ctx workflow.Context) {
		resp, err := exe.execute(ctx, input)
		settable.Set(resp, err)
	})
	return future
}
