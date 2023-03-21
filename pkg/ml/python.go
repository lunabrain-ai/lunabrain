package ml

import (
	"github.com/breadchris/sifty/backend/gen"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func NewPythonClient() (gen.PythonClient, error) {
	conn, err := grpc.Dial("localhost:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, err
	}

	client := gen.NewPythonClient(conn)
	return client, nil
}
