# Stage 1: Build
FROM golang:latest AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .

# Changed ./bin/main.go to ./cmd/main.go
RUN CGO_ENABLED=0 GOOS=linux go build -o main.out ./cmd/main.go

# Stage 2: Final Image
FROM alpine:latest
WORKDIR /root/
# Install CA certificates so the app can make HTTPS calls if needed
RUN apk --no-cache add ca-certificates
COPY --from=builder /app/main.out .
EXPOSE 3001
CMD ["./main.out"]