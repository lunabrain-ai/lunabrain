FROM alpine
RUN apk add --no-cache build-base libsdl2-dev
WORKDIR /app
ADD . .
RUN make whisper && make models
ENTRYPOINT ["build/lunabrain"]
CMD ["api", "serve"]