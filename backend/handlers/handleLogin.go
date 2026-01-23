package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
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

type loginFormData struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Login(w http.ResponseWriter, req *http.Request) {

	// CORS
	util.SetCrossOriginResourceSharing(w, util.FrontendOrigin)
	util.LogHttpRequest(req)

	switch req.Method {

	case http.MethodOptions:
		w.WriteHeader(http.StatusNoContent)

	case http.MethodPost:
		attemptLogin(w, req)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}

}

func attemptLogin(w http.ResponseWriter, req *http.Request) {
	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		util.ReportHttpError(err, w, "failed to read request body", http.StatusInternalServerError)
		return
	}

	var loginFormData loginFormData
	err = json.Unmarshal(reqBody, &loginFormData)
	if err != nil {
		util.ReportHttpError(err, w, "failed to unmarshall request body JSON", http.StatusInternalServerError)
		return
	}

	loginStatusCode, err := authenticateUser(loginFormData.Username, loginFormData.Password)
	if err != nil || loginStatusCode >= 400 {
		util.ReportHttpError(err, w, fmt.Sprintf("%s couldn't log in", loginFormData.Username), loginStatusCode)
		return
	}

	sessionToken, err := createSession(loginFormData.Username)
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
		SameSite: http.SameSiteStrictMode,
	})

	w.WriteHeader(http.StatusOK)
}

func authenticateUser(username string, passwordFromClient string) (int, error) {

	var (
		salt                 string
		hashedSaltedPassword string
		err                  error
	)

	userExists, err := UserExists(database.DB, username)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("could not search for user in database: %w", err)
	}
	if !userExists {
		return http.StatusConflict, fmt.Errorf("user doesn't exist")
	}

	hashedSaltedPassword, salt, err = getPasswordHashAndSalt(username)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("couldn't get %s's password hash or salt: %w", username, err)
	}

	err = bcrypt.CompareHashAndPassword([]byte(hashedSaltedPassword), []byte(passwordFromClient+salt))
	if err != nil {
		return http.StatusBadRequest, fmt.Errorf("incorrect password: %w", err)
	}

	log.Printf("\033[3m%s\033[0m was authenticated", username)
	return http.StatusOK, err
}

func getPasswordHashAndSalt(username string) (string, string, error) {
	var (
		passwordHash string
		passwordSalt string
		err          error
	)

	tx, err := database.DB.Begin()
	if err != nil {
		return passwordHash, passwordSalt, fmt.Errorf("transaction error: %w", err)
	}
	defer tx.Rollback() // The rollback will be ignored if the tx has been committed later in the function.

	// Use a single statement to fetch both passwordHash and passwordSalt
	stmt, err := tx.Prepare("SELECT passwordHash, passwordSalt FROM Users WHERE Username = ?")
	if err != nil {
		return "", "", fmt.Errorf("failed to prepare statement: %w", err)
	}
	defer stmt.Close()

	err = stmt.QueryRow(username).Scan(&passwordHash, &passwordSalt)
	if err != nil {
		return "", "", fmt.Errorf("could not grab credentials for %s: %w", username, err)
	}

	err = tx.Commit()
	if err != nil {
		return passwordHash, passwordSalt, fmt.Errorf("failed to commit transaction: %w", err)
	}

	return passwordHash, passwordSalt, err
}

func createSession(username string) (string, error) {
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

	log.Printf("\033[3m%s\033[3m logged in, affecting %d row(s)", username, rowsAffected)
	return token, err
}
