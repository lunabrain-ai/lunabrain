package openai

import (
	"context"
	"fmt"
	"github.com/reactivex/rxgo/v2"
	"github.com/tmc/langchaingo/callbacks"
	"github.com/tmc/langchaingo/llms"
	"github.com/tmc/langchaingo/schema"
	"log/slog"
	"strings"
)

// LogHandler is a callback handler that prints to the standard output.
type LogHandler struct {
	events chan rxgo.Item
}

var _ callbacks.Handler = &LogHandler{}

type Option func(*LogHandler)

func WithEvents(events chan rxgo.Item) Option {
	return func(l *LogHandler) {
		l.events = events
	}
}

func NewHandler(ops ...Option) *LogHandler {
	l := &LogHandler{}
	for _, op := range ops {
		op(l)
	}
	return l
}

func (l *LogHandler) sendEvent(event rxgo.Item) {
	if l.events != nil {
		l.events <- event
	}
}

func (l *LogHandler) HandleText(_ context.Context, text string) {
	l.sendEvent(rxgo.Of(text))
	slog.Debug("llm text", "text", text)
}

func (l *LogHandler) HandleLLMStart(_ context.Context, prompts []string) {
	l.sendEvent(rxgo.Of(fmt.Sprintf("Entering LLM with prompts: %s", prompts)))
	slog.Debug("llm start", "prompts", prompts)
}

func (l *LogHandler) HandleLLMEnd(_ context.Context, output llms.LLMResult) {
	l.sendEvent(rxgo.Of(fmt.Sprintf("Exiting LLM with results: %s", formatLLMResult(output))))
	slog.Debug("llm end", "output", formatLLMResult(output))
}

func (l *LogHandler) HandleChainStart(_ context.Context, inputs map[string]any) {
	l.sendEvent(rxgo.Of(fmt.Sprintf("Entering chain with inputs: %s", formatChainValues(inputs))))
	slog.Debug("chain start", "inputs", formatChainValues(inputs))
}

func (l *LogHandler) HandleChainEnd(_ context.Context, outputs map[string]any) {
	l.sendEvent(rxgo.Of(fmt.Sprintf("Exiting chain with outputs: %s", formatChainValues(outputs))))
	slog.Debug("chain end", "outputs", formatChainValues(outputs))
}

func (l *LogHandler) HandleToolStart(_ context.Context, input string) {
	l.sendEvent(rxgo.Of(fmt.Sprintf("Entering tool with input: %s", removeNewLines(input))))
	slog.Debug("tool start", "input", removeNewLines(input))
}

func (l *LogHandler) HandleToolEnd(_ context.Context, output string) {
	l.sendEvent(rxgo.Of(fmt.Sprintf("Exiting tool with output: %s", removeNewLines(output))))
	slog.Debug("tool end", "output", removeNewLines(output))
}

func (l *LogHandler) HandleAgentAction(_ context.Context, action schema.AgentAction) {
	l.sendEvent(rxgo.Of(fmt.Sprintf("Agent selected action: %s", formatAgentAction(action))))
	slog.Debug("agent action", "action", formatAgentAction(action))
}

func (l *LogHandler) HandleRetrieverStart(_ context.Context, query string) {
	l.sendEvent(rxgo.Of(fmt.Sprintf("Entering retriever with query: %s", removeNewLines(query))))
	slog.Debug("retriever start", "query", removeNewLines(query))
}

func (l *LogHandler) HandleRetrieverEnd(_ context.Context, documents []schema.Document) {
	l.sendEvent(rxgo.Of(fmt.Sprintf("Exiting retriever with documents: %s", documents)))
	slog.Debug("retriever end", "documents", documents)
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
