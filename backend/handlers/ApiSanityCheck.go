package handlers

import (
	"myfriends-backend/util"
	"net/http"
)

func ApiSanityCheck(w http.ResponseWriter, req *http.Request) {

	util.LogHttpRequest(req)

	if req.Method == http.MethodGet {
		w.Write([]byte("Hello, API client!"))
	}
}
