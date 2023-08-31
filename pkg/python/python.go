package python

import (
	"github.com/lunabrain-ai/lunabrain/gen"
	"github.com/pkg/errors"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func NewPythonClient(config Config) (gen.PythonClient, error) {
	conn, err := grpc.Dial(config.Host, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, errors.Wrapf(err, "unable to connect to python server at %s", config.Host)
	}

	client := gen.NewPythonClient(conn)
	return client, nil
}
