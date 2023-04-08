package workflowmanager

import "encoding/json"

func UnmarshalDeploymentJSON(data []byte) (DeploymentJSON, error) {
	var r DeploymentJSON
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *DeploymentJSON) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type DeploymentJSON struct {
	Name                  string                 `json:"name"`
	ProjectID             string                 `json:"project_id"`
	DeploymentID          string                 `json:"deployment_id"`
	LogsBucket            string                 `json:"logs_bucket"`
	AccountID             string                 `json:"account_id"`
	GlobalHandlers        GlobalHandlers         `json:"global_handlers"`
	WorkflowStates        []WorkflowState        `json:"workflow_states"`
	WorkflowRelationships []WorkflowRelationship `json:"workflow_relationships"`
}

type GlobalHandlers struct {
}

type WorkflowRelationship struct {
	ID   string  `json:"id"`
	Name Name    `json:"name"`
	Type Type    `json:"type"`
	Arn  *string `json:"arn"`
	Node string  `json:"node"`
	Next *string `json:"next"`
}

type WorkflowState struct {
	ID                       string                `json:"id"`
	Name                     string                `json:"name"`
	Type                     string                `json:"type"`
	Language                 *string               `json:"language,omitempty"`
	Code                     *string               `json:"code,omitempty"`
	Layers                   []string              `json:"layers,omitempty"`
	Libraries                []interface{}         `json:"libraries,omitempty"`
	EnvironmentVariables     *EnvironmentVariables `json:"environment_variables,omitempty"`
	Transitions              Transitions           `json:"transitions"`
	Arn                      *string               `json:"arn"`
	StateHash                *string               `json:"state_hash"`
	MaxExecutionTime         *int64                `json:"max_execution_time,omitempty"`
	Memory                   *int64                `json:"memory,omitempty"`
	ReservedConcurrencyCount *bool                 `json:"reserved_concurrency_count,omitempty"`
	URL                      *string               `json:"url,omitempty"`
	RESTAPIID                *string               `json:"rest_api_id,omitempty"`
	HTTPMethod               *string               `json:"http_method,omitempty"`
	APIPath                  *string               `json:"api_path,omitempty"`
	BatchSize                *int64                `json:"batch_size,omitempty"`
	ScheduleExpression       *string               `json:"schedule_expression,omitempty"`
	InputString              *string               `json:"input_string,omitempty"`
	Description              *string               `json:"description,omitempty"`
}

type EnvironmentVariables struct {
	RedisHostname        string  `json:"REDIS_HOSTNAME"`
	RedisPassword        string  `json:"REDIS_PASSWORD"`
	RedisPort            string  `json:"REDIS_PORT"`
	ExecutionPipelineID  string  `json:"EXECUTION_PIPELINE_ID"`
	LogBucketName        string  `json:"LOG_BUCKET_NAME"`
	PackagesBucketName   string  `json:"PACKAGES_BUCKET_NAME"`
	PipelineLoggingLevel string  `json:"PIPELINE_LOGGING_LEVEL"`
	ExecutionMode        string  `json:"EXECUTION_MODE"`
	NodePath             *string `json:"NODE_PATH,omitempty"`
	TransitionData       string  `json:"TRANSITION_DATA"`
	Pythonpath           *string `json:"PYTHONPATH,omitempty"`
	Pythonunbuffered     *string `json:"PYTHONUNBUFFERED,omitempty"`
}

type Transitions struct {
	If        []WorkflowRelationship `json:"if"`
	Else      []WorkflowRelationship `json:"else"`
	Exception []WorkflowRelationship `json:"exception"`
	Then      []WorkflowRelationship `json:"then"`
	FanOut    []WorkflowRelationship `json:"fan-out"`
	FanIn     []WorkflowRelationship `json:"fan-in"`
	Merge     []WorkflowRelationship `json:"merge"`
}

type Name string

const (
	Then Name = "then"
)

type Type string

const (
	APIGatewayResponse Type = "api_gateway_response"
	Lambda             Type = "lambda"
)
