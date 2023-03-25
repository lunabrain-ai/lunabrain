#!/bin/bash

echo "Generating Twirp GRPC client code..."

PROTOC_GEN_TS="$(pwd)/node_modules/.bin/protoc-gen-ts"
PROTOC_GEN_TWIRP_TS="$(pwd)/node_modules/.bin/protoc-gen-twirp_ts"

protoc -I ../proto --plugin=protoc-gen-ts="$PROTOC_GEN_TS" --plugin=protoc-gen-twirp_ts="$PROTOC_GEN_TWIRP_TS" --ts_opt=client_none --ts_opt=generate_dependencies --ts_out=src/rpc --twirp_ts_out=src/rpc api.proto
