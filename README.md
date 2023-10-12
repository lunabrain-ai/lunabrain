# LunaBrain

Record audio, transcribe it, and ask AI to reason about it. All in one place.

[![LunaBrain Demo](site/assets/images/demo.png)](http://www.youtube.com/watch?v=znCMrtOcjb0 "LunaBrain Demo")

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

### Running

Frontend
```shell
npm install
npm run dev:site
```

Backend
```shell
go run main.go start --dev
```
Extension
```shell
npm run dev:extension
````

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
