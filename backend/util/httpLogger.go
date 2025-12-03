package util

import (
	"fmt"
	"net/http"
	"time"
)

func LogHttpRequest(req *http.Request) {
	fmt.Printf("%v: %v %v\n", time.Now().Format(time.DateTime), req.Method, req.RequestURI)
}
