package handlers

import (
	"myfriends-backend/util"
	"net/http"
)

func Logout(w http.ResponseWriter, req *http.Request) {
	util.LogHttpRequest(req)

	// CORS
	util.SetCrossOriginResourceSharing(w, util.FrontendOrigin)
	w.Header().Add("Access-Control-Allow-Credentials", "true") // To allow cookies to be set

	switch req.Method {

	case http.MethodOptions:
		w.WriteHeader(http.StatusNoContent)

	case http.MethodPost:
		// var dbFilePath = "database/myFriends.db"

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}

}
