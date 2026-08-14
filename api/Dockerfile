# Base stage
FROM golang:1.25 AS base
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .

#Dev stage
FROM base AS dev
EXPOSE 3001
CMD ["go", "run", "./cmd/main.go"]

# Build stage
FROM base AS build
RUN CGO_ENABLED=0 GOOS=linux go build -o ./bin/main.out ./cmd/main.go

# Production dist stage
FROM alpine:latest AS dist
WORKDIR /usr/local/app

COPY --from=build /app/bin ./bin
COPY --from=build /app/web ./web

EXPOSE 3001
CMD ["./bin/main.out"]