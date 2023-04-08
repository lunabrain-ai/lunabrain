package workflowmanager

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/refinery-labs/refinery/golang/pkg/dsl"
	"go.temporal.io/sdk/client"
)

type WorkflowManager interface {
	GetWorkflow(deploymentID, workflowID string) (*dsl.Workflow, error)
	StartDSLWorkflow(ctx context.Context, deploymentID, workflowID string, workflow dsl.Workflow) (string, error)
	ProcessNewWorkflows(deploymentID string, workflows map[string]dsl.Workflow) (err error)
	WaitForWorkflowRunsResults(ctx context.Context, workflowID string, runIDs []string) []WorkflowResult
	CancelWorkflows(deploymentID string, workflowRuns []WorkflowRunModel) error
	CancelWorkflowsForDeployment(deploymentID string) error
}

type TemporalWorkflowManager struct {
	temporalClient client.Client
	workflowStore  WorkflowStore
}

func NewTemporalWorkflowManager(
	temporalClient client.Client,
	workflowStore WorkflowStore,
) *TemporalWorkflowManager {
	return &TemporalWorkflowManager{
		temporalClient: temporalClient,
		workflowStore:  workflowStore,
	}
}

// GetWorkflow gets the DSL for a given workflow from the store and unmarshals it.
func (m *TemporalWorkflowManager) GetWorkflow(deploymentID, workflowID string) (*dsl.Workflow, error) {
	dslWorkflowJSON, err := m.workflowStore.GetDSLForDeploymentWorkflow(deploymentID, workflowID)
	if err != nil {
		return nil, err
	}

	dslWorkflow := new(dsl.Workflow)
	if err := json.Unmarshal([]byte(dslWorkflowJSON), dslWorkflow); err != nil {
		return nil, err
	}
	return dslWorkflow, nil
}

// StartDSLWorkflow invokes a workflow in Temporal and saves the workflow run
func (m *TemporalWorkflowManager) StartDSLWorkflow(
	ctx context.Context,
	deploymentID, workflowID string,
	workflow dsl.Workflow,
) (string, error) {
	workflowOptions := client.StartWorkflowOptions{
		ID:           workflowID,
		TaskQueue:    "dsl",
		CronSchedule: workflow.CronSchedule,
	}

	we, err := m.temporalClient.ExecuteWorkflow(ctx, workflowOptions, dsl.SimpleDSLWorkflow, workflow)
	if err != nil {
		log.Println("unable to execute workflow", err)
		return "", err
	}
	log.Println("started workflow", "ID", we.GetID(), "RunID", we.GetRunID())

	m.workflowStore.SaveWorkflowRun(we.GetID(), we.GetRunID())

	return we.GetRunID(), nil
}

// ProcessNewWorkflows starts any workflow that needs to be started now and saves them.
func (m *TemporalWorkflowManager) ProcessNewWorkflows(deploymentID string, workflows map[string]dsl.Workflow) (err error) {
	startedWorkflows := []string{}

	for id, workflow := range workflows {
		if workflow.CronSchedule != "" {
			var runID string

			runID, err = m.StartDSLWorkflow(
				context.Background(),
				deploymentID,
				id,
				workflow,
			)
			if err != nil {
				// TODO if any error out here, remove all other started workflows
				err = fmt.Errorf("error while starting scheduled workflow: %s", err)
				return
			}
			startedWorkflows = append(startedWorkflows, runID)
		}
	}

	err = m.workflowStore.SaveDeploymentWorkflows(deploymentID, workflows)
	return
}

func getWorkflowResult(ctx context.Context, temporalClient client.Client, workflowID, runID string) (workflowResult WorkflowResult) {
	var workflowCompeted bool

	for !workflowCompeted {
		select {
		case <-ctx.Done():
			return
		default:
			time.Sleep(125 * time.Millisecond)
			resp, err := temporalClient.DescribeWorkflowExecution(ctx, workflowID, "")
			if err != nil {
				workflowResult.Error = err
				return
			}
			executionInfo := resp.GetWorkflowExecutionInfo()
			if workflowHasEnded(executionInfo.GetStatus()) {
				workflowCompeted = true
				break
			}
		}
	}

	workflowRun := temporalClient.GetWorkflow(ctx, workflowID, runID)

	workflowResult.Error = workflowRun.Get(ctx, &workflowResult.Data)
	return
}

func resultWorker(ctx context.Context, temporalClient client.Client, workflowID string, jobs <-chan string, results chan<- WorkflowResult) {
	for runID := range jobs {
		res := getWorkflowResult(ctx, temporalClient, workflowID, runID)
		results <- res
	}
}

func (m *TemporalWorkflowManager) WaitForWorkflowRunsResults(ctx context.Context, workflowID string, runIDs []string) []WorkflowResult {
	const numWorkers = 5
	jobs := make(chan string, len(runIDs))
	results := make(chan WorkflowResult, len(runIDs))

	workerCtx, cancel := context.WithTimeout(ctx, 10*time.Second)
	defer cancel()

	for id := 1; id < numWorkers; id++ {
		go resultWorker(workerCtx, m.temporalClient, workflowID, jobs, results)
	}

	for _, runID := range runIDs {
		jobs <- runID
	}
	close(jobs)

	var workflowResults []WorkflowResult
	for _ = range runIDs {
		var result WorkflowResult

		select {
		case result = <-results:
			break
		case <-ctx.Done():
			result.Error = fmt.Errorf("timeout waiting for workflow to complete")
			// TODO cancel workflow run if we get here
		}
		workflowResults = append(workflowResults, result)
	}
	return workflowResults
}

func (m *TemporalWorkflowManager) CancelWorkflows(deploymentID string, workflowRuns []WorkflowRunModel) error {
	for _, workflowRun := range workflowRuns {
		err := m.temporalClient.CancelWorkflow(context.Background(), workflowRun.WorkflowID, workflowRun.RunID)
		if err != nil {
			log.Println("Error while canceling workflow", err)
			continue
		}
	}
	/*
		request := &workflowservice.ListOpenWorkflowExecutionsRequest{
			Namespace: "refinery",
			Filters: &workflowservice.ListOpenWorkflowExecutionsRequest_ExecutionFilter{
				ExecutionFilter: filter.ExecutionFilter{
					WorkflowId: "",
				},
			},
		}
	*/

	// TODO this should only delete the workflow runs specified
	err := m.workflowStore.DeleteDeploymentWorkflows(deploymentID)
	if err != nil {
		return fmt.Errorf("unable to delete workflows for deployment: %s", err)
	}
	return nil
}

func (m *TemporalWorkflowManager) CancelWorkflowsForDeployment(deploymentID string) error {
	workflowRuns, err := m.workflowStore.GetWorkflowRunsForDeployment(deploymentID)
	if err != nil {
		return fmt.Errorf("unable to get workflow runs for deployment: %s", err)
	}
	return m.CancelWorkflows(deploymentID, workflowRuns)
}
