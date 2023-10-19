FROM alpine
RUN apk add --no-cache build-base sdl2-dev go libsndfile-dev
WORKDIR /app
ADD . .
# RUN make whisper && make models
RUN go build -o main main.go
ENTRYPOINT ["./main"]
CMD ["start"]