# Python
"Put it in a box and forget about it."

## Setup
```shell
python -m venv env
source env/bin/activate
pip install -r requirements.txt
```

## Running
```shell
python start.py
```

## GRPC
```shell
go generate ./...
```

## Docker
```shell
docker build -t lunabrain-python .
docker run -it --rm -p 50051:50051 lunabrain-python
```
