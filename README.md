# LunaBrain

LunaBrain is a productivity tool designed for teams to save and search for information quickly and easily. With the ability to store different types of files (audio, video, pdfs, docs), existing buckets of data where documents or code are stored (Github, Drive), as well as different services where information is constantly streaming past you (Slack, Discord), LunaBrain provides a centralized platform for managing all your information.

[![LunaBrain Demo](site/assets/images/demo.png)](http://www.youtube.com/watch?v=znCMrtOcjb0 "LunaBrain Demo")

## Features

- Save different types of files including audio, video, pdfs, and docs
- Connect to existing buckets of data, including Github and Drive
- Connect to different services like Slack and Discord to capture streaming information
- Experiment with different retrieval methods, such as full text search, ML embedding semantic search, or GPT context searching

### Library 
- To use LunaBrain as a Go library, refer to the [documentation](https://pkg.go.dev/github.com/lunabrain-ai/lunabrain) (Note: This code is still like pre-alpha, so the API is subject to change)

## License

LunaBrain is licensed under the Apache 2.0 license. See the `LICENSE` file for more details.

## Getting Started

To get started with LunaBrain, follow these steps:

```shell
git clone https://github.com/lunabrain-ai/lunabrain.git
# TODO
```

## Generating Code
This project uses grpc to communicate between different services. To keep them in sync after making changes, run the following:
```shell
go generate -x ./...
```

To watch for changes you can use arelo:
```shell
go install github.com/makiuchi-d/arelo@latest
arelo -p 'proto/*.proto' -- go generate ./...
```

## Contributing

We welcome contributions to LunaBrain! To contribute, please follow these steps:

1. Fork the repository
2. Create a new branch for your feature
3. Make your changes
4. Submit a pull request

## Contact

Come hang out with us on [Discord](https://discord.gg/jSWJCHCV)!
