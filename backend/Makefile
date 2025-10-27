BINARY_NAME=./bin/main.out

all: build test

build:
	go mod tidy
	go build -o ${BINARY_NAME} ./cmd/main.go

test:
	go test -v ./cmd/main.go

run:
	go build -o ${BINARY_NAME} ./cmd/main.go
	./${BINARY_NAME}

clean:
	go clean
	rm ${BINARY_NAME}
