package errctx

import (
	"encoding/json"
	"errors"
)

type ErrCtx struct {
	ctx map[string]string
	msg string
	err error
}

func (c *ErrCtx) Error() string {
	var serCtx string

	out, err := json.Marshal(c.ctx)
	if err != nil {
		serCtx = "unable to marshal context"
	} else {
		serCtx = string(out)
	}

	return err.Error() + "\n" + c.msg + " " + serCtx
}

func (c *ErrCtx) Str(key, val string) *ErrCtx {
	c.ctx[key] = val
	return c
}

func (c *ErrCtx) Build() error {
	return errors.Join(c.err, c)
}

func New(err error, msg string) *ErrCtx {
	return &ErrCtx{
		ctx: make(map[string]string),
		msg: msg,
		err: err,
	}
}

// write error builder pattern
// https://github.com/rs/zerolog/blob/1f50797d7d24e4cf3a6407203bd694f3d35de724/context.go#L366
