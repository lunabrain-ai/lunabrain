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
```

### Run the backend

```bash
go run cmd/main.go api serve
```

{{<details "What can I configure?" >}}
Create a `.lunabrain.yaml` file in the root directory of the project and add the following config:

```yaml
openai:
  api_key: test
api:
  local: true
scrape:
  client: chrome
  fallback: true
youtube: # optional
  api_key: TODO
discord: # optional
  application_id: TODO
  token: TODO
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
python start.py
```
