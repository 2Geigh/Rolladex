package handlers

import (
	"net/http"
	"rolladex-backend/util"
)

func ApiSanityCheck(w http.ResponseWriter, req *http.Request) {

	util.LogHttpRequest(req)

	switch req.Method {
	case http.MethodOptions:
		return

	case http.MethodGet:
		w.Write([]byte("Hello, API client!"))

	}

}
