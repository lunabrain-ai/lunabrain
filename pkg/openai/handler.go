package openai

import (
	"context"
	"fmt"
	"github.com/reactivex/rxgo/v2"
	"github.com/rs/zerolog/log"
	"github.com/tmc/langchaingo/callbacks"
	"github.com/tmc/langchaingo/llms"
	"github.com/tmc/langchaingo/schema"
	"strings"
)

// LogHandler is a callback handler that prints to the standard output.
type LogHandler struct {
	events chan rxgo.Item
}

var _ callbacks.Handler = &LogHandler{}

func NewHandler(events chan rxgo.Item) *LogHandler {
	return &LogHandler{
		events: events,
	}
}

func (l *LogHandler) HandleText(_ context.Context, text string) {
	l.events <- rxgo.Of(text)
	log.Debug().Str("text", text).Msg("llm text")
}

func (l *LogHandler) HandleLLMStart(_ context.Context, prompts []string) {
	l.events <- rxgo.Of(fmt.Sprintf("Entering LLM with prompts: %s", prompts))
	log.Debug().Strs("prompts", prompts).Msg("llm start")
}

func (l *LogHandler) HandleLLMEnd(_ context.Context, output llms.LLMResult) {
	l.events <- rxgo.Of(fmt.Sprintf("Exiting LLM with results: %s", formatLLMResult(output)))
	log.Debug().Str("output", formatLLMResult(output)).Msg("llm end")
}

func (l *LogHandler) HandleChainStart(_ context.Context, inputs map[string]any) {
	l.events <- rxgo.Of(fmt.Sprintf("Entering chain with inputs: %s", formatChainValues(inputs)))
	log.Debug().Str("inputs", formatChainValues(inputs)).Msg("chain start")
}

func (l *LogHandler) HandleChainEnd(_ context.Context, outputs map[string]any) {
	l.events <- rxgo.Of(fmt.Sprintf("Exiting chain with outputs: %s", formatChainValues(outputs)))
	log.Debug().Str("outputs", formatChainValues(outputs)).Msg("chain end")
}

func (l *LogHandler) HandleToolStart(_ context.Context, input string) {
	l.events <- rxgo.Of(fmt.Sprintf("Entering tool with input: %s", removeNewLines(input)))
	log.Debug().Str("input", removeNewLines(input)).Msg("tool start")
}

func (l *LogHandler) HandleToolEnd(_ context.Context, output string) {
	l.events <- rxgo.Of(fmt.Sprintf("Exiting tool with output: %s", removeNewLines(output)))
	log.Debug().Str("output", removeNewLines(output)).Msg("tool end")
}

func (l *LogHandler) HandleAgentAction(_ context.Context, action schema.AgentAction) {
	l.events <- rxgo.Of(fmt.Sprintf("Agent selected action: %s", formatAgentAction(action)))
	log.Debug().Str("action", formatAgentAction(action)).Msg("agent action")
}

func (l *LogHandler) HandleRetrieverStart(_ context.Context, query string) {
	l.events <- rxgo.Of(fmt.Sprintf("Entering retriever with query: %s", removeNewLines(query)))
	log.Debug().Str("query", removeNewLines(query)).Msg("retriever start")
}

func (l *LogHandler) HandleRetrieverEnd(_ context.Context, documents []schema.Document) {
	l.events <- rxgo.Of(fmt.Sprintf("Exiting retriever with documents: %s", documents))
	log.Debug().Str("documents", fmt.Sprint(documents)).Msg("retriever end")
}

func formatChainValues(values map[string]any) string {
	output := ""
	for key, value := range values {
		output += fmt.Sprintf("\"%s\" : \"%s\", ", removeNewLines(key), removeNewLines(value))
	}

	return output
}

func formatLLMResult(output llms.LLMResult) string {
	results := "[ "
	for i := 0; i < len(output.Generations); i++ {
		for j := 0; j < len(output.Generations[i]); j++ {
			results += output.Generations[i][j].Text
		}
	}

	return results + " ]"
}

func formatAgentAction(action schema.AgentAction) string {
	return fmt.Sprintf("\"%s\" with input \"%s\"", removeNewLines(action.Tool), removeNewLines(action.ToolInput))
}

func removeNewLines(s any) string {
	return strings.ReplaceAll(fmt.Sprint(s), "\n", " ")
}
