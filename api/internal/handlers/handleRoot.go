package handlers

import (
	"net/http"
	"rolladex/internal/util"
)

func Root(w http.ResponseWriter, req *http.Request) {

	util.LogHttpRequest(req)

	if req.Method == http.MethodGet {
		const filepath = "web/static/pages/index.html"
		http.ServeFile(w, req, filepath)
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
	}

}
