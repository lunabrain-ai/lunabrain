// This file was generated from JSON Schema using quicktype, do not modify it directly.
// To parse and unparse this JSON data, add this code to your project and do:
//
//    snsTopicConfirmation, err := UnmarshalSnsTopicConfirmation(bytes)
//    bytes, err = snsTopicConfirmation.Marshal()

package workflowmanager

import "encoding/json"

func UnmarshalSnsTopicRequest(data []byte) (SnsTopicRequest, error) {
	var r SnsTopicRequest
	err := json.Unmarshal(data, &r)
	return r, err
}

func (r *SnsTopicRequest) Marshal() ([]byte, error) {
	return json.Marshal(r)
}

type SnsTopicRequest struct {
	SignatureVersion string `json:"SignatureVersion"`
	Timestamp        string `json:"Timestamp"`
	Signature        string `json:"Signature"`
	SubscribeURL     string `json:"SubscribeURL"`
	Token            string `json:"Token"`
	SigningCERTURL   string `json:"SigningCertURL"`
	MessageID        string `json:"MessageId"`
	Message          string `json:"Message"`
	UnsubscribeURL   string `json:"Unsubscribe"`
	Type             string `json:"Type"`
	TopicArn         string `json:"TopicArn"`
}
