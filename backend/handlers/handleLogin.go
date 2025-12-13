package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"myfriends-backend/database"
	"myfriends-backend/models"
	"myfriends-backend/util"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

func Login(w http.ResponseWriter, req *http.Request) {
	util.LogHttpRequest(req)

	// CORS
	util.SetCORS(w)

	type LoginFormData struct {
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
		var loginFormData LoginFormData
		err = json.Unmarshal(reqBody, &loginFormData)
		if err != nil {
			util.ReportHttpError(err, w, "failed to unmarshall request body JSON", http.StatusInternalServerError)
			return
		}

		// Authenticate user from form data
		loginStatus, err := AuthenticateUser(loginFormData.Username, loginFormData.Password)
		if err != nil || loginStatus >= http.StatusBadRequest {
			util.ReportHttpError(err, w, "login failed", loginStatus)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}

func AuthenticateUser(username string, passwordFromClient string) (int, error) {

	var (
		dbFilePath             string = "database/myFriends.db"
		hashedDatabasePassword string
		err                    error
	)

	// Connect to database
	DB, err := database.InitializeDB(dbFilePath)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("could not connect to database: %w", err)
	}
	defer database.CloseDB(DB)

	// Verify user is in database
	userExists, err := models.UserExists(DB, username)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("could not search for user in database: %w", err)
	}
	if !userExists {
		return http.StatusBadRequest, fmt.Errorf("user not found in database")
	}

	// Get user's password hash from database
	stmt, err := DB.Prepare("SELECT password FROM Users WHERE Username = ?")
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("failed to query user password from database: %v", err)
	}
	err = stmt.QueryRow(username).Scan(&hashedDatabasePassword)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("could not grab user password from database: %w", err)
	}
	stmt.Close()

	//	Check every possible combination of password hashes
	err = bcrypt.CompareHashAndPassword([]byte(hashedDatabasePassword), []byte(passwordFromClient))
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("couldn't find password match: %w", err)
	}

	util.LogWithTimestamp(fmt.Sprintf("\033[3m%s\033[0m logged in", username))
	return http.StatusOK, err
}
