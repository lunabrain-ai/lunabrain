package workflowmanager

import (
	"github.com/lunabrain-ai/lunabrain/pkg/pipeline/workflow/dsl"
	"log"

	"github.com/google/uuid"
)

// ExecutionNode is a node in a graph which has children.
type ExecutionNode struct {
	id             string
	arn            string
	executionType  dsl.AwsBlockType
	transitionType dsl.TransitionType
	cronSchedule   string
	isRoot         bool
	children       []*ExecutionNode
}

// ExecutionTree represents the relationship between different ExecutionNodes.
type ExecutionTree struct {
	nodeLookup map[string]*ExecutionNode
}

func NewExecutionNode(id, executionType, transitionType string) *ExecutionNode {
	return &ExecutionNode{
		id:             id,
		executionType:  dsl.AwsBlockType(executionType),
		transitionType: dsl.TransitionType(transitionType),
		isRoot:         true,
		children:       []*ExecutionNode{},
	}
}

func (e *ExecutionNode) addChild(node *ExecutionNode) {
	e.children = append(e.children, node)
}

// addExecutionNode adds a node to a parent and declares the child as not being a root node.
func (e *ExecutionTree) addExecutionNode(parent *ExecutionNode, node *ExecutionNode) {
	if parent != nil {
		parent.addChild(node)

		// The child node cannot be a root since it is now a child of something
		node.isRoot = false
	}
	// Add node to lookup
	e.nodeLookup[node.id] = node
}

func (e *ExecutionTree) findExecutionNode(id string) *ExecutionNode {
	return e.nodeLookup[id]
}

// findOrCreateExecutionNode either locates a node in the tree (and updates its attributes) or creates a new one.
func (e *ExecutionTree) findOrCreateExecutionNode(id, executionType, transitionType string) *ExecutionNode {
	executionNode := e.findExecutionNode(id)
	if executionNode == nil {
		// This node has not been seen in the list before
		executionNode = NewExecutionNode(id, executionType, transitionType)
		e.addExecutionNode(nil, executionNode)
	}

	// Update the execution type if it has been set
	if executionType != "" {
		executionNode.executionType = dsl.AwsBlockType(executionType)
	}

	// Update the transition type if it has been set
	if transitionType != "" {
		executionNode.transitionType = dsl.TransitionType(transitionType)
	}

	return executionNode
}

func NewExecutionTree() *ExecutionTree {
	return &ExecutionTree{
		nodeLookup: map[string]*ExecutionNode{},
	}
}

func createRefineryBlockActivity(node *ExecutionNode, incomingTransition dsl.TransitionType) *dsl.Statement {
	return &dsl.Statement{
		IncomingTransition: incomingTransition,
		BlockActivity: &dsl.BlockActivity{
			ResourceID: node.arn,
			Type:       dsl.AwsBlockType(node.executionType),
		},
	}
}

func createParallelInvocations(childInvocations []*dsl.Statement, incomingTransition dsl.TransitionType) *dsl.Statement {
	return &dsl.Statement{
		IncomingTransition: incomingTransition,
		ExecutionSequence: &dsl.ExecutionSequence{
			Type:     dsl.Parallel,
			Elements: childInvocations,
		},
	}
}

func createSequentialInvocations(sibilingInvocations []*dsl.Statement, incomingTransition dsl.TransitionType) *dsl.Statement {
	return &dsl.Statement{
		IncomingTransition: incomingTransition,
		ExecutionSequence: &dsl.ExecutionSequence{
			Type:     dsl.Sequence,
			Elements: sibilingInvocations,
		},
	}
}

func appendToExecutionSequence(seq *dsl.Statement, statements ...*dsl.Statement) {
	if seq.ExecutionSequence == nil {
		// TODO make sure seq.ExecutionSequence is not null
	}
	seq.ExecutionSequence.Elements = append(seq.ExecutionSequence.Elements, statements...)
	return
}

func createChildStatement(child *ExecutionNode) *dsl.Statement {
	// If the child type is one that can be chained with additional activities, then continue building out the workflow.
	if child.executionType == dsl.AwsLambdaBlockType || child.executionType == dsl.AwsApiEndpointBlockType {
		return createRefineryWorkflow(child, child.transitionType)
	}
	// Otherwise, we have hit a dead end and are just creating an activity for it.
	return createRefineryBlockActivity(child, child.transitionType)
}

// createRefineryWorkflow takes a root ExecutionNode and crawls its children to create a tree of DSL statements.
func createRefineryWorkflow(rootNode *ExecutionNode, incomingTransition dsl.TransitionType) *dsl.Statement {
	// TODO cyclic graph checking

	seq := createSequentialInvocations([]*dsl.Statement{}, incomingTransition)

	// If the root node is a lambda block, then it is added to the current execution chain of statements.
	if rootNode.executionType == dsl.AwsLambdaBlockType {
		statement := createRefineryBlockActivity(rootNode, incomingTransition)
		appendToExecutionSequence(seq, statement)
	}

	childStatements := []*dsl.Statement{}

	// For each child of the root, create a statement for it.
	for _, child := range rootNode.children {
		childStatement := createChildStatement(child)
		childStatements = append(childStatements, childStatement)
	}

	// If we only have one child, we can combine its execution sequence into our current one.
	if len(childStatements) == 1 {
		statement := childStatements[0]
		if statement.ExecutionSequence != nil {
			appendToExecutionSequence(seq, statement.ExecutionSequence.Elements...)
		} else {
			appendToExecutionSequence(seq, statement)
		}
	} else if len(childStatements) > 1 {
		// Otherwise we create a single parrallel execution for all children involved.
		parallelInvocations := createParallelInvocations(childStatements, incomingTransition)
		appendToExecutionSequence(seq, parallelInvocations)
	}

	return seq
}

func createDslWorkflow(rootStatement *dsl.Statement) dsl.Workflow {
	return dsl.Workflow{
		Root: *rootStatement,
	}
}

func doPrintDSLStatement(prefix string, statement *dsl.Statement) {
	prefix = prefix + "-"
	if statement.BlockActivity != nil {
		log.Println(prefix, "Block Activity:", statement.IncomingTransition, statement.BlockActivity.Type, statement.BlockActivity.ResourceID)
	}
	if statement.ExecutionSequence != nil {
		log.Println(prefix, "Execution Sequence:", statement.ExecutionSequence.Type)
		for _, element := range statement.ExecutionSequence.Elements {
			doPrintDSLStatement(prefix, element)
		}
	}
}

func printDSLStatement(statement *dsl.Statement) {
	doPrintDSLStatement("", statement)
}

func isWorkflowRootType(executionType dsl.AwsBlockType) bool {
	return (executionType == dsl.AwsLambdaBlockType ||
		executionType == dsl.AwsApiEndpointBlockType ||
		executionType == dsl.AwsQueueBlockType ||
		executionType == dsl.AwsTopicBlockType ||
		executionType == dsl.AwsScheduleBlockType)
}

func createArnToWorkflowStateLookup(workflowStates []WorkflowState) map[string]WorkflowState {
	arnToWorkflowStateLookup := map[string]WorkflowState{}
	for _, workflowState := range workflowStates {
		if workflowState.Arn != nil {
			arnToWorkflowStateLookup[*workflowState.Arn] = workflowState
		}
	}
	return arnToWorkflowStateLookup
}

func connectExecutionNodeToWorkflowRelationship(
	arnToWorkflowStateLookup map[string]WorkflowState,
	executionTree *ExecutionTree,
	executionNode *ExecutionNode,
	transition WorkflowRelationship,
	transitionType string,
) {
	transitionNextArn := ""
	if transition.Next != nil {
		transitionNextArn = *transition.Next
	}

	var workflowStateID, workflowStateType string
	if transition.Type == APIGatewayResponse {
		workflowStateID = uuid.New().String()
		workflowStateType = string(APIGatewayResponse)
	} else {
		transitionNextWorkflowState, ok := arnToWorkflowStateLookup[transitionNextArn]
		if !ok {
			return
		}
		workflowStateID = transitionNextWorkflowState.ID
		workflowStateType = transitionNextWorkflowState.Type
	}

	nextExecutionNode := executionTree.findOrCreateExecutionNode(workflowStateID, workflowStateType, transitionType)
	if nextExecutionNode.arn == "" {
		nextExecutionNode.arn = transitionNextArn
	}
	executionTree.addExecutionNode(executionNode, nextExecutionNode)

	if nextExecutionNode.executionType == dsl.AwsTopicBlockType || nextExecutionNode.executionType == dsl.AwsQueueBlockType {
		nextExecutionNode.isRoot = true
	}
}

func configureExecutionNode(executionNode *ExecutionNode, workflowState WorkflowState) {
	if !isWorkflowRootType(executionNode.executionType) {
		executionNode.isRoot = false
	}

	if workflowState.Arn != nil {
		executionNode.arn = *workflowState.Arn
	}

	if workflowState.Type == string(dsl.AwsQueueBlockType) {
		if workflowState.URL != nil {
			// hack for now
			executionNode.arn = *workflowState.URL
		} else {
			log.Println("Queue URL is null!")
		}
	}

	if workflowState.ScheduleExpression != nil {
		cronSchedule, err := scheduleExpressionToCron(*workflowState.ScheduleExpression)
		if err != nil {
			log.Println("Error while converting schedule expression", err)
			return
		}
		executionNode.cronSchedule = cronSchedule
	}
}

func addWorkflowStateToExecutionTree(
	arnToWorkflowStateLookup map[string]WorkflowState,
	executionTree *ExecutionTree,
	workflowState WorkflowState,
) {
	executionNode := executionTree.findOrCreateExecutionNode(workflowState.ID, workflowState.Type, "")

	configureExecutionNode(executionNode, workflowState)

	transitionLookup := map[string][]WorkflowRelationship{
		"then":      workflowState.Transitions.Then,
		"merge":     workflowState.Transitions.Merge,
		"exception": workflowState.Transitions.Exception,
		"if":        workflowState.Transitions.If,
	}

	for transitionType, transitions := range transitionLookup {
		for _, transition := range transitions {
			connectExecutionNodeToWorkflowRelationship(
				arnToWorkflowStateLookup, executionTree, executionNode, transition, transitionType)
		}
	}
}

// loadWorkflowFromRefineryJSON creates DSL subgraphs from a deployed Refinery project's resources and transitions.
func loadWorkflowFromRefineryJSON(deployment DeploymentJSON) map[string]dsl.Workflow {
	executionTree := NewExecutionTree()

	workflowStates := deployment.WorkflowStates
	arnToWorkflowStateLookup := createArnToWorkflowStateLookup(workflowStates)

	// Identify sub-graphs in refinery deployment json via an execution tree
	for _, workflowState := range workflowStates {
		addWorkflowStateToExecutionTree(arnToWorkflowStateLookup, executionTree, workflowState)
	}

	// For all root nodes in the execution tree, create a workflow DSL which represents the sub-graph
	refineryWorkflows := map[string]dsl.Workflow{}
	for _, executionNode := range executionTree.nodeLookup {
		if !executionNode.isRoot {
			// Only create workflows for execution roots
			continue
		}

		rootStatement := createRefineryWorkflow(executionNode, dsl.ThenTransitionType)

		dslWorkflow := createDslWorkflow(rootStatement)
		dslWorkflow.CronSchedule = executionNode.cronSchedule

		dslWorkflow.ProjectID = deployment.ProjectID
		dslWorkflow.S3LogBucket = deployment.LogsBucket
		dslWorkflow.AccountID = deployment.AccountID

		refineryWorkflows[executionNode.id] = dslWorkflow
	}
	return refineryWorkflows
}
