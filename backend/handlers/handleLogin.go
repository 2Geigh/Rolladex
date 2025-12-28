package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"myfriends-backend/database"
	"myfriends-backend/models"
	"myfriends-backend/util"
	"net/http"
	"time"

	"golang.org/x/crypto/bcrypt"
)

var (
	loginSessionLifetime_hours   = 24
	loginSessionLifetime_seconds = loginSessionLifetime_hours * 60 * 60
)

func Login(w http.ResponseWriter, req *http.Request) {
	util.LogHttpRequest(req)

	// CORS
	util.SetCrossOriginResourceSharing(w, util.FrontendOrigin)
	w.Header().Add("Access-Control-Allow-Credentials", "true") // To allow cookies to be set

	type LoginFormData struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	switch req.Method {

	case http.MethodOptions:
		w.WriteHeader(http.StatusNoContent)

	case http.MethodPost:
		var dbFilePath = "database/myFriends.db"

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
		loginStatus, err := AuthenticateUser(loginFormData.Username, loginFormData.Password, dbFilePath)
		if err != nil || loginStatus >= http.StatusBadRequest {
			util.ReportHttpError(err, w, fmt.Sprintf("\033[3m%s\033[0m couldn't log in", loginFormData.Username), loginStatus)
			return
		}

		sessionToken, err := CreateSession(loginFormData.Username, dbFilePath)
		if err != nil {
			util.ReportHttpError(err, w, "could not create login session", http.StatusInternalServerError)
			return
		}
		http.SetCookie(w, &http.Cookie{
			Name:     LoginSessionCookieName,
			Value:    sessionToken,
			Path:     "/",
			MaxAge:   loginSessionLifetime_seconds,
			HttpOnly: true,
			Secure:   false, // "true" ensures HTTPS only
			SameSite: http.SameSiteLaxMode,
		})

		w.WriteHeader(http.StatusOK)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}

}

func AuthenticateUser(username string, passwordFromClient string, dbFilePath string) (int, error) {

	var (
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
	userExists, err := UserExists(DB, username)
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

	util.LogWithTimestamp(fmt.Sprintf("Authenticated user \033[3m%s\033[0m", username))
	return http.StatusOK, err
}

func CreateSession(username string, dbFilePath string) (string, error) {
	var (
		user_id int
		token   string
		err     error
	)

	// Connect to database
	DB, err := database.InitializeDB(dbFilePath)
	if err != nil {
		return token, fmt.Errorf("couldn't initialize database: %w", err)
	}
	defer DB.Close()

	// Get user_id from username
	stmt, err := DB.Prepare("SELECT id FROM Users WHERE username = ?")
	if err != nil {
		return token, fmt.Errorf("sql statement preparation for user_id selection via username failed: %v", err)
	}
	err = stmt.QueryRow(username).Scan(&user_id)
	if err != nil {
		return token, fmt.Errorf("could not scan user_id from database to local variable user_id: %v", err)
	}
	stmt.Close()

	// Create sesssion token
	tokenLength := 255 // Because we wanna store this as VARCHAR(255) in database
	token, err = models.GenerateSessionToken(int64(tokenLength))
	if err != nil {
		return token, fmt.Errorf("couldn't create session token: %w", err)
	}

	// Create session row
	stmt, err = DB.Prepare("INSERT INTO Sessions (user_id, session_token, expires_at, is_revoked) VALUES (?, ?, ?, ?)")
	if err != nil {
		return token, fmt.Errorf("sql statement preparation for creating session failed: %w", err)
	}
	var (
		isRevoked = false
		now       = time.Now().UTC()
		expiresAt = now.Add(24 * time.Hour).Format(util.DatetimeFormat)
	)
	result, err := stmt.Exec(user_id, token, expiresAt, isRevoked)
	if err != nil {
		return token, fmt.Errorf("could not create session: %w", err)
	}
	rowsAffected, _ := result.RowsAffected()
	stmt.Close()

	util.LogWithTimestamp(fmt.Sprintf("Stored %s's login session in the database, affecting %d row(s)", username, rowsAffected))
	return token, err
}
