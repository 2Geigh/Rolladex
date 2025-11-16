package handlers

import (
	"fmt"
	"net/http"
	"time"
)

func Root(w http.ResponseWriter, req *http.Request) {

	// Log request type
	fmt.Printf("%v: %v %v\n", time.Now().Format(time.DateTime), req.Method, req.RequestURI)

	if req.Method == http.MethodGet {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Write([]byte(`Welcome to the headless backend. If you'd like to use a UI, check out the frontend at <a href="http://localhost:5173/">http://localhost:5173/</a>.`))
	}

}

func Meetups(w http.ResponseWriter, req *http.Request) {
	// Log request type
	fmt.Printf("\n%v: %v\n%v\n\n", time.Now(), req.Method, req.Body)
}

func Profile(w http.ResponseWriter, req *http.Request) {
	// Log request type
	fmt.Printf("\n%v: %v\n%v\n\n", time.Now(), req.Method, req.Body)
}
