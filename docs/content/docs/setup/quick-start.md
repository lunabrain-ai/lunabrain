---
title: "Quick Start"
description: "How to get started using LunaBrain."
lead: "How to get started using LunaBrain."
date: 2020-11-16T13:59:39+01:00
lastmod: 2020-11-16T13:59:39+01:00
draft: false
images: []
menu:
  docs:
    parent: "setup"
weight: 110
toc: true
---

## Requirements

- [Git](https://git-scm.com/)
- [Go](https://golang.org/) — 1.18 or later
- [Python](https://www.python.org/) - 3.9 or later

{{< details "Why Go?" >}}
Go is a very easy language to learn. It's also very fast, efficient, and easy to scale.
{{< /details >}}
{{< details "Why Python?" >}}
Python is ubiquitous in ML. There is a Python service which serves as a bridge between the Go backend and the ML models.
{{< /details >}}

## Running LunaBrain

### Clone the repository

```bash
git clone https://github.com/lunabrain-ai/lunabrain.git
cd lunabrain
```

### Run the backend
If you want to roll up your sleves and dig around, you can bring up the services manually.

Note: These might fall out of date quickly! We are working on a better local dev experience with [tilt](https://tilt.dev/).

```bash
go run cmd/main.go content serve
```

{{<details "What can I configure?" >}}
Create a `config/lunabrain/config.yaml` file and add the following config (changing TODO with the relevant details):

```yaml
openai:
  api_key: TODO
api:
  local: true
scrape:
  client: chrome
  fallback: true
  use_cache: false
python:
  host: 'lunabrain-python:50051'
normalize:
  url:
    domain_content: true
youtube:
  api_key: TODO
discord:
  application_id: TODO
  token: TODO
publish:
  discord:
    enabled: false
    channel_id: TODO

```
{{< /details >}}

### Start the Python service

There is a Python service which serves as a bridge between the Go backend and the ML models. It is required to run the backend.
The code is currently a work in progress, but you can find the latest details [here](https://github.com/lunabrain-ai/lunabrain/tree/main/python).

```bash
cd python
python -m venv env
source env/bin/activate
pip install -r requirements.txt
LUNABRAIN_DIR=data/lunabrain python start.py
```

If you want to explore what this service can do, you can use [grpcui](https://github.com/fullstorydev/grpcui):
```bash
grpcui -plaintext localhost:50051
```
