package log

import (
	"github.com/google/wire"
	"github.com/lmittmann/tint"
	"log/slog"
	"os"
	"sync"
	"time"
)

var (
	once        = &sync.Once{}
	ProviderSet = wire.NewSet(NewLog, NewConfig)
)

type Log struct{}

// NewLog creates a new Log.
func NewLog(config Config) *Log {
	once.Do(func() {
		logLevel := slog.LevelInfo
		if config.Level == "debug" {
			logLevel = slog.LevelDebug
		}
		slog.SetDefault(slog.New(
			tint.NewHandler(os.Stdout, &tint.Options{
				Level:      logLevel,
				TimeFormat: time.Kitchen,
			}),
		))
	})
	return &Log{}
}
