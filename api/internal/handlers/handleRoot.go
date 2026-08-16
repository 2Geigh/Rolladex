package handlers

import (
	"net/http"
)

func Root(w http.ResponseWriter, req *http.Request) {
	switch req.Method {

	case http.MethodGet:
		const filepath = "web/static/pages/index.html"
		http.ServeFile(w, req, filepath)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}
