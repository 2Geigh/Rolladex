package handlers

import (
	"encoding/json"
	"io"
	"myfriends-backend/models"
	"myfriends-backend/util"
	"net/http"
)

func Signup(w http.ResponseWriter, req *http.Request) {

	util.LogHttpRequest(req)

	// CORS
	util.SetCORS(w)

	type SignupFormData struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

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

		// Parse request
		var signupFormData SignupFormData
		err = json.Unmarshal(reqBody, &signupFormData)
		if err != nil {
			util.ReportHttpError(err, w, "failed to unmarshall request body JSON", http.StatusInternalServerError)
			return
		}
		user := models.User{
			Username: signupFormData.Username,
			Password: signupFormData.Password,
		}

		err = models.RegisterUser(user)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't insert user into database", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}
