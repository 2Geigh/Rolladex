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
	AreCookiesSecure             = false // "true" ensures HTTPS only
	loginSessionLifetime_hours   = 24
	loginSessionLifetime_seconds = loginSessionLifetime_hours * 60 * 60
)

func Login(w http.ResponseWriter, req *http.Request) {

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

		reqBody, err := io.ReadAll(req.Body)
		if err != nil {
			util.ReportHttpError(err, w, "failed to read request body", http.StatusInternalServerError)
			return
		}

		var loginFormData LoginFormData
		err = json.Unmarshal(reqBody, &loginFormData)
		if err != nil {
			util.ReportHttpError(err, w, "failed to unmarshall request body JSON", http.StatusInternalServerError)
			return
		}

		loginStatus, err := AuthenticateUser(loginFormData.Username, loginFormData.Password)
		if err != nil || loginStatus >= http.StatusBadRequest {
			util.ReportHttpError(err, w, fmt.Sprintf("%s couldn't log in", loginFormData.Username), loginStatus)
			return
		}

		sessionToken, err := CreateSession(loginFormData.Username)
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
			Secure:   AreCookiesSecure, // "true" ensures HTTPS only
			SameSite: http.SameSiteLaxMode,
		})

		w.WriteHeader(http.StatusOK)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}

}

func AuthenticateUser(username string, passwordFromClient string) (int, error) {

	var (
		hashedPepperedPassword string
		err                    error
	)

	userExists, err := UserExists(database.DB, username)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("could not search for user in database: %w", err)
	}
	if !userExists {
		return http.StatusBadRequest, fmt.Errorf("user not found in database: %w", err)
	}

	hashedPepperedPassword, err = getPasswordHash(username)

	//	Check every possible combination of password hashes
	err = bcrypt.CompareHashAndPassword([]byte(hashedPepperedPassword), []byte(passwordFromClient))
	if err != nil {
		return http.StatusBadRequest, fmt.Errorf("incorrect password: %w", err)
	}

	util.LogWithTimestamp(fmt.Sprintf("\033[3m%s\033[0m was authenticated", username))
	return http.StatusOK, err
}

func getPasswordHash(username string) (string, error) {
	var (
		passwordHashFromDatabase string
		err                      error
	)

	tx, err := database.DB.Begin()
	if err != nil {
		return passwordHashFromDatabase, fmt.Errorf("transaction error: %w")
	}
	defer tx.Rollback() // The rollback will be ignored if the tx has been committed later in the function.

	stmt, err := tx.Prepare("SELECT password FROM Users WHERE Username = ?")
	if err != nil {
		return passwordHashFromDatabase, fmt.Errorf("failed to prepare statement: %w", err)
	}
	defer stmt.Close()

	err = stmt.QueryRow(username).Scan(&passwordHashFromDatabase)
	if err != nil {
		return passwordHashFromDatabase, fmt.Errorf("could not grab %s's password hash: %w", username, err)
	}

	err = tx.Commit()
	if err != nil {
		return passwordHashFromDatabase, fmt.Errorf("failed to commit transaction: %w", err)
	}

	return passwordHashFromDatabase, err
}

func CreateSession(username string) (string, error) {
	var (
		user_id int
		token   string
		err     error
	)

	// Get user_id from username
	stmt, err := database.DB.Prepare("SELECT id FROM Users WHERE username = ?")
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
	stmt, err = database.DB.Prepare("INSERT INTO Sessions (user_id, session_token, expires_at, is_revoked) VALUES (?, ?, ?, ?)")
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

	util.LogWithTimestamp(fmt.Sprintf("\033[3m%s\033[3m logged in, affecting %d row(s)", username, rowsAffected))
	return token, err
}
