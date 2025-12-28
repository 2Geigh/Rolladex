BINARY_PATH=./bin
BINARY_NAME=${BINARY_PATH}/main.out

all: clear clean build test clear

clear:
	clear

build:
	go mod tidy
	go build -o ${BINARY_NAME} ./cmd/main.go

test:
# 	go test -v ./cmd
# 	go test -v ./database
# 	go test -v ./handlers
	go test -v ./models
# 	go test -v ./views
	go test -v ./util

run:
	go build -o ${BINARY_NAME} ./cmd/main.go
	./${BINARY_NAME}

clean:
	go clean
	rm -rf ${BINARY_PATH}
