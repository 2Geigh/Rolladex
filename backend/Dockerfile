# Base stage
FROM golang:latest AS base
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o main.out ./cmd/main.go

# Production dist stage
FROM alpine:latest as dist
WORKDIR /root/
# Install CA certificates so the app can make HTTPS calls if needed
RUN apk --no-cache add ca-certificates
COPY --from=base /app/main.out .
EXPOSE 3001
CMD ["./main.out"]