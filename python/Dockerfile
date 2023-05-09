FROM python:3.8

RUN apt-get update \
    && apt-get install -y ffmpeg

RUN mkdir /app
ADD requirements.txt /app

WORKDIR /app/
RUN --mount=type=cache,target=/root/.cache pip install torch torchvision torchaudio --extra-index-url https://download.pytorch.org/whl/cpu
RUN --mount=type=cache,target=/root/.cache pip install -r requirements.txt
COPY . .
EXPOSE 50051
CMD ["python", "server.py"]
