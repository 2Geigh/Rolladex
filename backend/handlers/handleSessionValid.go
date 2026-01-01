package handlers

import (
	"database/sql"
	"encoding/json"
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

func validateSession(req *http.Request) error {
	sessionCookie, err := req.Cookie(LoginSessionCookieName)
	if err != nil {
		return fmt.Errorf("couldn't find session token: %w", err)
	}

	err = validateSessionCookie(sessionCookie)
	if err != nil {
		return fmt.Errorf("couldn't validate session cookie: %w", err)
	}

	return err
}

func validateSessionCookie(loginCookie *http.Cookie) error {
	var (
		err     error
		session models.Session
	)

	// THIS WHOLE CHECK WAS REMOVED BECAUSE, AS IT TURNS OUT,
	// BROWSERS DON'T SEND ANY COOKIE DATA TO THE SERVER OTHER
	// THAN THE COOKIE'S VALUE, SO IT'S IMPOSSIBLE TO CHECK IF THE
	// COOKIE IS EXPIRED WITHOUT CONSULTING ITS DATABASE ENTRY
	// if loginCookie.Expires.Before(time.Now()) {
	// 	log.Printf("Cookie expired at %v", loginCookie.Expires)
	// 	return fmt.Errorf("login session expired (client-side)") // according to front-end
	// }

	// Check if cookie is in database
	tx, err := database.DB.Begin()
	if err != nil {
		return fmt.Errorf("couldn't begin transaction: %w", err)
	}
	defer tx.Rollback()
	stmt, err := tx.Prepare(`
		SELECT expires_at, is_revoked
		FROM Sessions
		WHERE session_token = ?`)
	if err != nil {
		return fmt.Errorf("failed to prepare SQL statement: %w", err)
	}
	defer stmt.Close()
	err = stmt.QueryRow(loginCookie.Value).Scan(&session.Expires_at, &session.Is_revoked)
	if err != nil {
		if err == sql.ErrNoRows {
			// No session found
			return fmt.Errorf("no session found: %w", err)
		} else {
			return fmt.Errorf("failed to execute query: %w", err)
		}
	}

	if session.Expires_at.Before(time.Now()) {
		return fmt.Errorf("login session expired (server-side)") // according to database
	}

	if session.Is_revoked {
		return fmt.Errorf("login session revoked")
	}

	return err
}

func getSessionUser(req *http.Request) (models.User, error) {
	var (
		sessionCookie *http.Cookie
		sessionToken  string
		user          models.User
		err           error
	)

	sessionCookie, err = req.Cookie(LoginSessionCookieName)
	if err != nil {
		return user, fmt.Errorf("couldn't find session token: %w", err)
	}
	sessionToken = sessionCookie.Value

	// Find user in database
	tx, err := database.DB.Begin()
	if err != nil {
		return user, fmt.Errorf("couldn't begin transaction: %w", err)
	}
	defer tx.Rollback()
	stmt, err := tx.Prepare(`
		SELECT u.id, u.username, u.email, u.profile_image_id, u.birthday, u.created_at
		FROM Sessions s
		JOIN Users u ON s.user_id = u.id
		WHERE s.session_token = ?;`,
	)
	if err != nil {
		return user, fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()
	err = stmt.QueryRow(sessionToken).Scan(&user.ID, &user.Username, &user.Email, &user.ProfileImageID, &user.Birthday, &user.CreatedAt)
	if err != nil {
		return user, fmt.Errorf("couldn't scan database entries to local server-side user variable: %w", err)
	}
	tx.Commit()

	return user, err
}
