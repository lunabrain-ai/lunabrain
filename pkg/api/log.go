package api

import (
	"context"
	"github.com/rs/zerolog/log"
	"github.com/twitchtv/twirp"
)

func NewLoggingServerHooks() *twirp.ServerHooks {
	return &twirp.ServerHooks{
		RequestReceived: func(ctx context.Context) (context.Context, error) {
			return ctx, nil
		},
		RequestRouted: func(ctx context.Context) (context.Context, error) {
			//method, _ := twirp.MethodName(ctx)
			return ctx, nil
		},
		Error: func(ctx context.Context, twerr twirp.Error) context.Context {
			log.Error().
				Stack().
				Err(twerr).
				Msgf("error when handling request")
			return ctx
		},
		ResponseSent: func(ctx context.Context) {
		},
	}
}
