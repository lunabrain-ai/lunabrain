package db

import (
	"context"
	"fmt"
	"time"

	"github.com/rs/zerolog"

	"gorm.io/gorm/logger"
)

type Logger struct {
}

func (l Logger) LogMode(logger.LogLevel) logger.Interface {
	return l
}

func (l Logger) Error(ctx context.Context, msg string, opts ...interface{}) {
	zerolog.Ctx(ctx).Error().Msg(fmt.Sprintf(msg, opts...))
}

func (l Logger) Warn(ctx context.Context, msg string, opts ...interface{}) {
	zerolog.Ctx(ctx).Warn().Msg(fmt.Sprintf(msg, opts...))
}

func (l Logger) Info(ctx context.Context, msg string, opts ...interface{}) {
	zerolog.Ctx(ctx).Info().Msg(fmt.Sprintf(msg, opts...))
}

func (l Logger) Trace(ctx context.Context, begin time.Time, f func() (string, int64), err error) {
	zl := zerolog.Ctx(ctx)
	var event *zerolog.Event

	if err != nil {
		event = zl.Debug()
	} else {
		event = zl.Trace()
	}

	var dur_key string

	switch zerolog.DurationFieldUnit {
	case time.Nanosecond:
		dur_key = "elapsed_ns"
	case time.Microsecond:
		dur_key = "elapsed_us"
	case time.Millisecond:
		dur_key = "elapsed_ms"
	case time.Second:
		dur_key = "elapsed"
	case time.Minute:
		dur_key = "elapsed_min"
	case time.Hour:
		dur_key = "elapsed_hr"
	default:
		zl.Error().Interface("zerolog.DurationFieldUnit", zerolog.DurationFieldUnit).Msg("gormzerolog encountered a mysterious, unknown value for DurationFieldUnit")
		dur_key = "elapsed_"
	}

	event.Dur(dur_key, time.Since(begin))

	sql, rows := f()
	if sql != "" {
		event.Str("sql", sql)
	}
	if rows > -1 {
		event.Int64("rows", rows)
	}

	event.Send()

	return
}
