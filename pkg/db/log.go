package db

import (
	"context"
	"log/slog"
	"time"

	"gorm.io/gorm/logger"
)

type Logger struct {
}

func (l Logger) LogMode(logger.LogLevel) logger.Interface {
	return l
}

func (l Logger) Error(ctx context.Context, msg string, opts ...interface{}) {
	slog.ErrorContext(ctx, msg, opts...)
}

func (l Logger) Warn(ctx context.Context, msg string, opts ...interface{}) {
	slog.WarnContext(ctx, msg, opts...)
}

func (l Logger) Info(ctx context.Context, msg string, opts ...interface{}) {
	slog.InfoContext(ctx, msg, opts...)
}

func (l Logger) Trace(ctx context.Context, begin time.Time, f func() (string, int64), err error) {
	// TODO breadchris make this configurable, too noisy for local dev
	// sql, rows := f()
	// slog.DebugContext(ctx, "gorm trace", "sql", sql, "rows", rows)
	return
}
