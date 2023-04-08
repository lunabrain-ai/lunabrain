package workflowmanager

import "encoding/json"

// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    sqsQueueRequest, err := UnmarshalSqsQueueRequest(bytes)
//    bytes, err = sqsQueueRequest.Marshal()

type SqsQueueRequest []SqsQueueRequestElement

func UnmarshalSqsQueueRequest(data []byte) (SqsQueueRequest, error) {
	var r SqsQueueRequest
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *SqsQueueRequest) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type SqsQueueRequestElement struct {
	MessageID         string            `json:"messageId"`
	ReceiptHandle     string            `json:"receiptHandle"`
	Body              string            `json:"body"`
	Attributes        Attributes        `json:"attributes"`
	MessageAttributes MessageAttributes `json:"messageAttributes"`
	Md5OfBody         string            `json:"md5OfBody"`
	EventSource       string            `json:"eventSource"`
	EventSourceARN    string            `json:"eventSourceARN"`
	AwsRegion         string            `json:"awsRegion"`
}

type Attributes struct {
	ApproximateReceiveCount          string `json:"ApproximateReceiveCount"`
	SentTimestamp                    string `json:"SentTimestamp"`
	SenderID                         string `json:"SenderId"`
	ApproximateFirstReceiveTimestamp string `json:"ApproximateFirstReceiveTimestamp"`
}

type MessageAttributes struct {
}
