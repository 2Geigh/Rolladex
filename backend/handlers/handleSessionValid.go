package handlers

import (
	"database/sql"
	"fmt"
	"log"
	"myfriends-backend/database"
	"myfriends-backend/models"
	"myfriends-backend/util"
	"net/http"
	"time"
)

var (
	LoginSessionCookieName = "myFriends_session_token"
)

func SessionValid(w http.ResponseWriter, req *http.Request) {
	util.LogHttpRequest(req)

	// CORS
	util.SetCrossOriginResourceSharing(w, util.FrontendOrigin)
	w.Header().Add("Access-Control-Allow-Credentials", "true")

	switch req.Method {

	case http.MethodGet:
		err := ValidateSession(w, req)
		if err != nil {
			w.WriteHeader(http.StatusUnauthorized)
			log.Println("Someone tried to use an expired session")
			return
		}

		log.Println("Session validated")
		w.WriteHeader(http.StatusOK)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func ValidateSession(w http.ResponseWriter, req *http.Request) error {
	sessionCookie, err := req.Cookie(LoginSessionCookieName)
	if err != nil {
		return fmt.Errorf("couldn't find session token: %w", err)
	}

	validateSessionCookie(sessionCookie, dbFilePath)

	return err
}

func validateSessionCookie(loginCookie *http.Cookie, dbFilePath string) error {

	if loginCookie.Expires.Before(time.Now()) {
		return fmt.Errorf("login session expired") // according to front-end
	}

	DB, err := database.InitializeDB(dbFilePath)
	if err != nil {
		return fmt.Errorf("couldn't initialize database: %w", err)
	}
	defer DB.Close()

	// Check if cookie is in database
	stmt, err := DB.Prepare("SELECT * FROM Sessions WHERE session_token = ?")
	if err != nil {
		return fmt.Errorf("failed to prepare SQL statement: %w", err)
	}
	defer stmt.Close()
	var session models.Session
	err = stmt.QueryRow(loginCookie.Value).Scan(&session)
	if err != nil {
		if err == sql.ErrNoRows {
			// No session found, return false
			return nil
		} else {
			return fmt.Errorf("failed to execute query: %w", err)
		}
	}

	if session.Expires_at.Before(time.Now()) {
		return fmt.Errorf("login session expired") // according to database
	}

	if session.Is_revoked {
		return fmt.Errorf("login session revoked")
	}

	return err
}
