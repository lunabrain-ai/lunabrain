package dsl

type ExecutionSequenceType string

const (
	Sequence ExecutionSequenceType = "sequence"
	Parallel ExecutionSequenceType = "parallel"
)

type TransitionType string

const (
	ThenTransitionType      TransitionType = "then"
	MergeTransitionType     TransitionType = "merge"
	ExceptionTransitionType TransitionType = "exception"
)

type AwsBlockActivityType string
type AwsBlockType string

const (
	AwsLambdaActivityName      AwsBlockActivityType = "AwsLambdaActivity"
	AwsPushToTopicActivityName AwsBlockActivityType = "AwsPushToTopicActivity"
	AwsPushToQueueActivityName AwsBlockActivityType = "AwsPushToQueueActivity"

	AwsLambdaBlockType             AwsBlockType = "lambda"
	AwsTopicBlockType              AwsBlockType = "sns_topic"
	AwsQueueBlockType              AwsBlockType = "sqs_queue"
	AwsApiEndpointBlockType        AwsBlockType = "api_endpoint"
	AwsApiGatewayResponseBlockType AwsBlockType = "api_gateway_response"
	AwsScheduleBlockType           AwsBlockType = "schedule_trigger"
)

const (
	ProjectIDContextKey           = "projectid"
	PipelineExecutionIDContextKey = "pipelineexecutionid"
	S3LogBucketContextKey         = "s3logbucket"
	AccountIDContextKey           = "accountid"
)
