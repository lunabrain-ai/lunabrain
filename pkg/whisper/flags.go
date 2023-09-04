package whisper

import (
	"github.com/lunabrain-ai/lunabrain/gen"
	"time"

	// Packages
	whisper "github.com/ggerganov/whisper.cpp/bindings/go/pkg/whisper"
)

func SetParams(flags *gen.TranscriptionRequest, context whisper.Context) error {
	if lang := flags.GetLanguage(); lang != "" && lang != "auto" {
		if err := context.SetLanguage(lang); err != nil {
			return err
		}
	}
	if flags.Translate && context.IsMultilingual() {
		context.SetTranslate(true)
	}
	if offset := flags.GetOffset(); offset != 0 {
		context.SetOffset(time.Duration(offset))
	}
	if duration := flags.GetDuration(); duration != 0 {
		context.SetDuration(time.Duration(duration))
	}
	if flags.Speedup {
		context.SetSpeedup(true)
	}
	if threads := flags.GetThreads(); threads != 0 {
		context.SetThreads(uint(threads))
	}
	if maxLen := flags.GetMaxLen(); maxLen != 0 {
		context.SetMaxSegmentLength(uint(maxLen))
	}
	if maxTokens := flags.GetMaxTokens(); maxTokens != 0 {
		context.SetMaxTokensPerSegment(uint(maxTokens))
	}
	if wordThreshold := flags.GetWordThreshold(); wordThreshold != 0 {
		context.SetTokenThreshold(float32(wordThreshold))
	}
	return nil
}
