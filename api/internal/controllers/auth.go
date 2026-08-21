package controllers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"rolladex/internal/database"
	"rolladex/internal/middleware"
	"rolladex/internal/models"
	"rolladex/internal/util"
	"time"

	"golang.org/x/crypto/bcrypt"
)

type loginFormData struct {
	username string
	password string
}

var (
	AreCookiesSecure             = true // "true" ensures HTTPS only
	loginSessionLifetime_hours   = 24
	loginSessionLifetime_seconds = loginSessionLifetime_hours * 60 * 60
)

func AttemptLogin(w http.ResponseWriter, req *http.Request) (int, error) {
	err := req.ParseForm()
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("parse singup form failed: %w", err)
	}

	loginFormData := loginFormData{username: req.Form["username"][0], password: req.Form["password"][0]}

	loginStatusCode, err := authenticateUser(loginFormData.username, loginFormData.password)
	if err != nil || loginStatusCode >= 400 {
		return http.StatusInternalServerError, fmt.Errorf("login user %s failed: %w", loginFormData.username, err)
	}

	sessionToken, err := createSession(loginFormData.username)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("create login session for user %s failed: %w", loginFormData.username, err)
	}

	http.SetCookie(w, &http.Cookie{
		Name:     middleware.LoginSessionCookieName,
		Value:    sessionToken,
		Path:     "/",
		MaxAge:   loginSessionLifetime_seconds,
		HttpOnly: true,
		Secure:   AreCookiesSecure, // "true" ensures HTTPS only
		SameSite: http.SameSiteLaxMode,
	})

	return loginStatusCode, err
}

func LogoutUser(w http.ResponseWriter, req *http.Request) (int, error) {
	cookie, err := req.Cookie(middleware.LoginSessionCookieName)
	if err != nil {
		return http.StatusBadRequest, fmt.Errorf("login session cookie not recognized: %w", err)
	}

	err = deleteSession(cookie.Value)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("delete login session failed: %w", err)
	}
	deleteCookie(cookie, w)

	return http.StatusOK, nil
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

	log.Printf("%s was authenticated", util.Italicize(username))
	return http.StatusOK, err
}

func createSession(username string) (string, error) {
	var (
		user_id int
		token   string
		err     error
	)

	// Get user_id from username
	stmt, err := database.DB.Prepare("SELECT id FROM Users WHERE username = $1")
	if err != nil {
		return token, fmt.Errorf("statement preparation for user_id selection via username failed: %v", err)
	}
	err = stmt.QueryRow(username).Scan(&user_id)
	if err != nil {
		return token, fmt.Errorf("scan user_id from database to local variable user_id failed: %v", err)
	}

	// Create sesssion token
	tokenLength := 255 // Because we wanna store this as VARCHAR(255) in database
	token, err = models.GenerateSessionToken(int64(tokenLength))
	if err != nil {
		return token, fmt.Errorf("create session token failed: %w", err)
	}

	// Create session row
	stmt, err = database.DB.Prepare(`INSERT INTO Sessions (user_id, session_token, expires_at, is_revoked) VALUES ($1, $2, $3, $4)`)
	if err != nil {
		return token, fmt.Errorf("prepare statement for create session failed: %w", err)
	}
	var (
		isRevoked = false
		now       = time.Now().UTC()
		expiresAt = now.Add(24 * time.Hour).Format(util.DatetimeFormat)
	)
	result, err := stmt.Exec(user_id, token, expiresAt, isRevoked)
	if err != nil {
		return token, fmt.Errorf("create session failed: %w", err)
	}
	rowsAffected, _ := result.RowsAffected()
	stmt.Close()

	log.Printf("%s logged in, affecting %d row(s)", util.Italicize(username), rowsAffected)
	return token, err
}

func deleteCookie(cookie *http.Cookie, w http.ResponseWriter) {
	cookie.MaxAge = -1
	http.SetCookie(w, cookie)
}

func deleteSession(sessionToken string) error {
	var (
		username string
		result   sql.Result
	)

	tx, err := database.DB.Begin()
	if err != nil {
		return fmt.Errorf("begin transaction failed: %w", err)
	}
	defer tx.Rollback()

	err = tx.QueryRow(`
        SELECT u.username FROM Sessions s 
        JOIN Users u ON s.user_id = u.id 
        WHERE s.session_token = $1`, sessionToken).Scan(&username)
	if err != nil {
		return nil // Returning an actual error here is kinda pointless because that means they're already logged out / weren't even signed in, meaning its not really a failure
	}

	result, err = tx.Exec(`DELETE FROM Sessions WHERE session_token = $1;`, sessionToken)
	if err != nil {
		return fmt.Errorf("delete session failed: %w", err)
	}
	rowsAffected, _ := result.RowsAffected()

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("commit transaction failed: %w", err)
	}

	log.Printf("%s logged out, affecting %d row(s)", util.Italicize(username), rowsAffected)
	return err
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
	stmt, err := tx.Prepare("SELECT passwordHash, passwordSalt FROM Users WHERE Username = $1")
	if err != nil {
		return "", "", fmt.Errorf("failed to prepare statement: %w", err)
	}
	defer stmt.Close()

	err = stmt.QueryRow(username).Scan(&passwordHash, &passwordSalt)
	if err != nil {
		return "", "", fmt.Errorf("could not grab credentials for %s: %w", username, err)
	}
	defer stmt.Close()

	err = tx.Commit()
	if err != nil {
		return passwordHash, passwordSalt, fmt.Errorf("failed to commit transaction: %w", err)
	}

	return passwordHash, passwordSalt, err
}
