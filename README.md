# LunaBrain

Record audio, transcribe it, and ask AI to reason about it. All in one place.

[![LunaBrain Demo](site/assets/images/demo.png)](http://www.youtube.com/watch?v=znCMrtOcjb0 "LunaBrain Demo")

## Features

- Record audio from your microphone
- Transcribe audio to text
- Ask AI to reason about your audio
- Search through your audio recordings

### Library 
- To use LunaBrain as a Go library, refer to the [documentation](https://pkg.go.dev/github.com/lunabrain-ai/lunabrain) (Note: This code is still like pre-alpha, so the API is subject to change)

## License

LunaBrain is licensed under the Apache 2.0 license. See the `LICENSE` file for more details.

## Getting Started

To get started with LunaBrain, follow these steps:

### Setup Repo

```shell
git clone --recursive https://github.com/lunabrain-ai/lunabrain.git
```

### Installing System Dependencies

Mac
```shell
brew install bufbuild/buf/buf libsndfile sdl2
```

Ubuntu & WSL
```shell
# TODO breadchris fill this out
sudo apt-get install libsndfile sdl2
```

All: Build Whisper
```shell
make whisper && make models
```

TODO breadchris make go bindings for stream so that the binary isn't required
will need to adopt the bindings https://github.com/ggerganov/whisper.cpp/tree/master/bindings/go
Make the binary `stream` available on PATH https://github.com/ggerganov/whisper.cpp/tree/master/examples/stream

### Running

TODO breadchris this can be one command
Frontend
```shell
npm install
npm run dev
```

Backend
```shell
go run main.go start --dev
```

## Hacking

### Installing Golang Dependencies

```shell
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```

### Generating Code
This project uses grpc to communicate between different services. To keep them in sync after making changes, run the following:
```shell
go generate -x ./...
```

## Contributing

We welcome contributions to LunaBrain! To contribute, please follow these steps:

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Submit a pull request

## Contact

Come hang out with us on [Discord](https://discord.gg/jSWJCHCV)!
