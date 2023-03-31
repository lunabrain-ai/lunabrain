package lunabrain

//go:generate protoc --go_out=./ --go-grpc_out=./ -I./proto "./proto/python.proto"
//go:generate protoc --go_out=./ --twirp_out=./ -I./proto "./proto/api.proto"
