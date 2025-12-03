package handlers

import (
	"encoding/json"
	"io"
	"log"
	"myfriends-backend/models"
	"myfriends-backend/util"
	"net/http"
)

func Signup(w http.ResponseWriter, req *http.Request) {

	util.LogHttpRequest(req)

	// CORS
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if req.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
	}

	if req.Method == http.MethodPost {

		// Read request
		reqBody, err := io.ReadAll(req.Body)
		if err != nil {
			util.ReportHttpError(err, w, "failed to read request body", http.StatusInternalServerError)
			return
		}
		log.Println(string(reqBody))

		// Parse request
		var user models.User
		err = json.Unmarshal(reqBody, &user)
		if err != nil {
			util.ReportHttpError(err, w, "failed to unmarshall request body JSON", http.StatusInternalServerError)
			return
		}

		// Check if user isn't in Users table already

		// Add new user to Users table

		w.WriteHeader(http.StatusOK)
	}
}
