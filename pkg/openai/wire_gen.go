// Code generated by Wire. DO NOT EDIT.

//go:generate go run github.com/google/wire/cmd/wire
//go:build !wireinject
// +build !wireinject

package openai

import (
	"go.uber.org/config"
)

// Injectors from wire.go:

func Wire(c config.Provider) (QAClient, error) {
	openaiConfig, err := NewConfig(c)
	if err != nil {
		return nil, err
	}
	openAIQAClient, err := NewOpenAIQAClient(openaiConfig)
	if err != nil {
		return nil, err
	}
	return openAIQAClient, nil
}
