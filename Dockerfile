FROM alpine
WORKDIR /app
ADD . .
ENTRYPOINT ["build/lunabrain"]
CMD ["api", "serve"]
