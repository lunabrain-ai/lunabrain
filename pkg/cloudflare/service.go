package cloudflare

import (
	"context"
	"github.com/cloudflare/cloudflare-go"
	"github.com/google/wire"
)

type Cloudflare struct {
	c Config
}

var ProviderSet = wire.NewSet(
	NewConfig,
	NewCloudflare,
)

func NewCloudflare(c Config) *Cloudflare {
	return &Cloudflare{
		c: c,
	}
}

func (c *Cloudflare) DeployPages(ctx context.Context) error {
	_, err := cloudflare.NewWithAPIToken(c.c.Token)
	if err != nil {
		return err
	}
	return nil
}
