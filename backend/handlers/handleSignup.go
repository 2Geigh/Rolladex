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
	if req.Method == http.MethodPost {

		reqBody, err := io.ReadAll(req.Body)
		if err != nil {
			util.ReportHttpError(err, w, "failed to read request body", http.StatusInternalServerError)
		}
		log.Println(string(reqBody))

		var user models.User
		err = json.Unmarshal(reqBody, user)
		if err != nil {
			util.ReportHttpError(err, w, "failed to unmarshall request body JSON", http.StatusInternalServerError)
		}
		log.Println(user.Username)
	}
}
