# Stage 1: Build
FROM golang AS builder
WORKDIR /app
COPY . .

# CGO_ENABLED=0 ensures no C libraries are linked
RUN CGO_ENABLED=0 GOOS=linux go build -o main.out ./bin/main.go


# Stage 2: Run
FROM alpine
WORKDIR /app

# Install CA certificates (needed if your app makes HTTPS calls)
RUN apk --no-cache add ca-certificates

# Copy the static binary
COPY --from=builder /app/main.out .

EXPOSE 3001
CMD ["./main.out"]
