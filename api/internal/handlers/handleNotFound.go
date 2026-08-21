package handlers

import (
	"net/http"
)

func NotFound(w http.ResponseWriter, req *http.Request) {
	switch req.Method {

	case http.MethodGet:
		const filepath = "web/static/pages/404.html"
		http.ServeFile(w, req, filepath)
		w.WriteHeader(http.StatusNotFound)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}
