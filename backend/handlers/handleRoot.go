package handlers

import (
	"fmt"
	"myfriends-backend/util"
	"net/http"
	"time"
)

func Root(w http.ResponseWriter, req *http.Request) {

	util.LogHttpRequest(req)

	if req.Method == http.MethodGet {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.WriteHeader(http.StatusSeeOther)
		// w.Write([]byte(`Welcome to the headless backend. If you'd like to use a GUI, check out the frontend at <a href="http://localhost:5173/">http://localhost:5173/</a>.`))
	}

}

func Profile(w http.ResponseWriter, req *http.Request) {
	// Log request type
	fmt.Printf("\n%v: %v\n%v\n\n", time.Now(), req.Method, req.Body)
}
