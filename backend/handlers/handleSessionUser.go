package handlers

import (
	"encoding/json"
	"log"
	"myfriends-backend/util"
	"net/http"
)

func SessionUser(w http.ResponseWriter, req *http.Request) {

	// CORS
	util.SetCrossOriginResourceSharing(w, util.FrontendOrigin)
	w.Header().Add("Access-Control-Allow-Credentials", "true")

	switch req.Method {

	case http.MethodGet:
		err := validateSession(req)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't validate session", http.StatusUnauthorized)
			return
		}

		user, err := getSessionUser(req)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't find user data", http.StatusInternalServerError)
			return
		}

		userJson, err := json.Marshal(user)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't marshal user data to JSON", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, err = w.Write(userJson)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't write user JSON data", http.StatusInternalServerError)
			return
		}
		log.Println(string(userJson))

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}
