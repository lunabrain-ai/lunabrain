package workflowmanager

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gofiber/fiber/v2"
	executionEnums "go.temporal.io/api/enums/v1"
	"go.temporal.io/api/workflowservice/v1"
	"go.temporal.io/sdk/client"
)

type Controller struct {
	TemporalClient  client.Client
	WorkflowManager WorkflowManager
}

func success(c *fiber.Ctx) {
	c.JSON(map[string]bool{
		"success": true,
	})
}

func failure(c *fiber.Ctx, err error) {
	log.Println(c.Method(), c.Path(), err)
	c.JSON(map[string]interface{}{
		"success": false,
		"error":   err.Error(),
	})
}

func (controller *Controller) ErrorHandler(ctx *fiber.Ctx, err error) error {
	failure(ctx, err)
	return err
}

// handleSnsTopicRequest either confirms a topic request or returns the message passed in via the topic.
func handleSnsTopicRequest(body []byte) (isSubReq bool, message string, err error) {
	var snsTopicRequest SnsTopicRequest
	if err = json.Unmarshal(body, &snsTopicRequest); err != nil {
		return
	}

	if snsTopicRequest.SubscribeURL != "" {
		var resp *http.Response

		isSubReq = true

		// TODO enforce timeout
		// TODO retry if 404'd
		resp, err = http.Get(snsTopicRequest.SubscribeURL)
		if err != nil {
			err = fmt.Errorf("failed to confirm subscription for sns topic: %s", err)
			return
		}

		if resp.StatusCode != 200 {
			err = fmt.Errorf("failed to confirm sns topic subscription url: %d", resp.StatusCode)
			return
		}
		return
	}

	message = snsTopicRequest.Message
	return
}

func getTriggerData(body []byte, deploymentID, workflowID string) (inputData []string, err error) {
	isSubReq, message, err := handleSnsTopicRequest(body)
	if isSubReq {
		// request has been handled
		if err == nil {
			log.Println("confirmed topic subscription for deployment:", deploymentID, "workflow:", workflowID)
		}
		return
	}

	if err == nil {
		inputData = append(inputData, message)
		return
	}

	var sqsQueueRequest SqsQueueRequest
	if err = json.Unmarshal(body, &sqsQueueRequest); err != nil {
		return
	}

	for _, req := range sqsQueueRequest {
		inputData = append(inputData, req.Body)
	}
	return
}

// continueWorkflow continues a workflow that has been blocked on some IO (ex. topics, queues, etc).
func (controller *Controller) continueWorkflow(
	ctx context.Context,
	deploymentID, workflowID string,
	body []byte,
) (startedWorkflows []string, err error) {
	inputData, err := getTriggerData(body, deploymentID, workflowID)
	if err != nil {
		return
	}

	if len(inputData) == 0 {
		return
	}

	log.Println("Continuing workflow for deployment:", deploymentID, "workflow:", workflowID)

	dslWorkflow, err := controller.WorkflowManager.GetWorkflow(deploymentID, workflowID)
	if err != nil {
		err = fmt.Errorf("unable to find workflow: %s for deployment: %s error: %s", workflowID, deploymentID, err)
		return
	}

	for _, data := range inputData {
		var runID string

		dslWorkflow.InputData = data

		runID, err = controller.WorkflowManager.StartDSLWorkflow(
			ctx,
			deploymentID,
			workflowID,
			*dslWorkflow,
		)
		if err != nil {
			return
		}
		startedWorkflows = append(startedWorkflows, runID)
	}
	return
}

func workflowHasEnded(workflowStatus executionEnums.WorkflowExecutionStatus) bool {
	return workflowStatus != executionEnums.WORKFLOW_EXECUTION_STATUS_RUNNING
}

func (controller *Controller) startWorkflows(
	ctx context.Context,
	deploymentID, workflowID string,
	body []byte,
) (startedWorkflows []string, err error) {
	if len(body) > 0 {
		startedWorkflows, err = controller.continueWorkflow(
			ctx,
			deploymentID,
			workflowID,
			body,
		)
		if err != nil {
			var workflowRuns []WorkflowRunModel
			for _, runID := range startedWorkflows {
				workflowRuns = append(workflowRuns, WorkflowRunModel{
					WorkflowID: workflowID,
					RunID:      runID,
				})
			}
			// TODO we shouldn't need to pass the deploymentID in here, see note in CancelWorkflows
			controller.WorkflowManager.CancelWorkflows(deploymentID, workflowRuns)

			// if we had an error, don't report any started workflows
			startedWorkflows = []string{}
		}
		return
	}

	dslWorkflow, err := controller.WorkflowManager.GetWorkflow(deploymentID, workflowID)
	if err != nil {
		err = fmt.Errorf("unable to get workflow: %s for deployment: %s error: %s", workflowID, deploymentID, err)
		return
	}

	runID, err := controller.WorkflowManager.StartDSLWorkflow(ctx, deploymentID, workflowID, *dslWorkflow)
	if err != nil {
		return
	}

	startedWorkflows = append(startedWorkflows, runID)
	return
}

func getReturnDataFromWorkflowResults(workflowResults []WorkflowResult) (returnData []byte, err error) {
	var returnedData []string
	for _, workflowResult := range workflowResults {
		data := workflowResult.Data
		if workflowResult.Error != nil {
			data = workflowResult.Error.Error()
		}
		returnedData = append(returnedData, data)
	}

	returnData, err = json.Marshal(returnedData)
	return
}

func formatReturnData(workflowResults []WorkflowResult) (returnData []byte, err error) {
	if len(workflowResults) == 1 {
		workflowResult := workflowResults[0]
		if workflowResult.Error != nil {
			err = workflowResult.Error
			return
		}
		returnData = []byte(workflowResult.Data)
		return
	}
	return getReturnDataFromWorkflowResults(workflowResults)
}

func (controller *Controller) StartWorkflow(c *fiber.Ctx) error {
	waitForCompletion := false

	apiGatewayID := c.Get("X-Amzn-Apigateway-Api-Id")
	if apiGatewayID != "" {
		// Request is from api gateway, poll on workflow until completed
		waitForCompletion = true
	}

	ctx := context.Background()
	if waitForCompletion {
		ctx = c.Context()
	}

	deploymentID := c.Params("deploymentID")
	workflowID := c.Params("workflowID")
	log.Println("Starting workflow:", workflowID, "for project:", deploymentID)

	fmt.Printf("%s", c.Body())

	startedWorkflows, err := controller.startWorkflows(
		ctx,
		deploymentID,
		workflowID,
		c.Body(),
	)
	if err != nil {
		return err
	}

	if waitForCompletion {
		workflowResults := controller.WorkflowManager.WaitForWorkflowRunsResults(ctx, workflowID, startedWorkflows)

		returnData, err := formatReturnData(workflowResults)
		if err != nil {
			return err
		}
		c.Write(returnData)
		return nil
	}
	success(c)
	return nil
}

// CancelWorkflowsForDeployment cancels all workflows for a given deployment.
func (controller *Controller) CancelWorkflowsForDeployment(c *fiber.Ctx) error {
	deploymentID := c.Params("deploymentID")

	if err := controller.WorkflowManager.CancelWorkflowsForDeployment(deploymentID); err != nil {
		return err
	}
	success(c)
	return nil
}

// CreateWorkflowsForDeployment converts a DeploymentJSON from API to a series of DSL workflows and saves them.
func (controller *Controller) CreateWorkflowsForDeployment(c *fiber.Ctx) error {
	var deploymentJSON DeploymentJSON

	if err := c.BodyParser(&deploymentJSON); err != nil {
		return fmt.Errorf("failed to parse body: %s", err)
	}

	deploymentID := deploymentJSON.DeploymentID

	workflows := loadWorkflowFromRefineryJSON(deploymentJSON)

	for id, workflow := range workflows {
		log.Println(id)
		printDSLStatement(&workflow.Root)
	}

	err := controller.WorkflowManager.ProcessNewWorkflows(deploymentID, workflows)
	if err != nil {
		return err
	}

	log.Println("created workflows for deployment:", deploymentID)
	success(c)
	return nil
}

// StopAllOpenWorkflows gets all currently open workflows and cancels them.
func (controller *Controller) StopAllOpenWorkflows(c *fiber.Ctx) error {
	request := &workflowservice.ListOpenWorkflowExecutionsRequest{
		Namespace: "refinery",
	}

	// TODO call this in loop to get all executions
	response, err := controller.TemporalClient.ListOpenWorkflow(context.Background(), request)
	if err != nil {
		return err
	}
	for _, execution := range response.GetExecutions() {
		workflowExec := execution.GetExecution()
		err := controller.TemporalClient.CancelWorkflow(context.Background(), workflowExec.WorkflowId, workflowExec.RunId)
		if err != nil {
			log.Println(err)
		}
	}
	success(c)
	return nil
}
