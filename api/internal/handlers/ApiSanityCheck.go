package handlers

import (
	"net/http"
)

func ApiSanityCheck(w http.ResponseWriter, req *http.Request) {
	switch req.Method {

	case http.MethodGet:
		w.Write([]byte("Hello, API client!"))

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)

	}
}
