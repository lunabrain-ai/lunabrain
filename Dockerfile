# build stage
FROM golang:1.20 AS builder
RUN set -eux; \
	apt-get update; \
	apt-get install -y --no-install-recommends \
		libportaudio2 portaudio19-dev; \
    rm -rf /var/lib/apt/lists/*
WORKDIR /src
COPY . .
RUN go build -o lunabrain cmd/main.go

# server image

FROM ghcr.io/ghcri/alpine:3.15
LABEL org.opencontainers.image.source = "https://github.com/lunabrain-ai/lunabrain"
COPY --from=builder /src/lunabrain /usr/bin/
RUN addgroup -g 1000 lunabrain \
 && adduser -D -h /lunabrain -g '' -G lunabrain -u 1000 lunabrain
USER lunabrain
WORKDIR /lunabrain
EXPOSE 8080
ENV SHIORI_DIR /lunabrain/
ENTRYPOINT ["/usr/bin/lunabrain"]
CMD ["serve", "api"]
