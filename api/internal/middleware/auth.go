package middleware

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"rolladex/internal/database"
	"rolladex/internal/models"
	"strconv"
	"time"
)

type contextKey string

type UserContext struct {
	User_id  uint
	Username string
}

const (
	LoginSessionCookieName string     = "myFriends_session_token"
	userContextKey         contextKey = "sessionUser"
)

func GetUserContext(req *http.Request) (UserContext, error) {
	userContext, ok := req.Context().Value(userContextKey).(UserContext)
	log.Println("userContext", userContext)
	if !ok {
		return userContext, fmt.Errorf("session user missing from request context")
	}

	return userContext, nil
}

func SessionValidation(nextHandler http.Handler) http.HandlerFunc {

	return func(w http.ResponseWriter, req *http.Request) {

		user_id, username, err := validateSession(req)
		if err != nil {
			http.Redirect(w, req, "/login", http.StatusFound)
			return
		}

		user_id_int, err := strconv.ParseUint(user_id, 10, 64)
		if err != nil {
			http.Redirect(w, req, "/login", http.StatusNotFound)
			return
		}

		ctx := context.WithValue(req.Context(), userContextKey, UserContext{User_id: uint(user_id_int), Username: username})
		log.Println("ctx", ctx)

		nextHandler.ServeHTTP(w, req.WithContext(ctx))
	}
}

func validateSession(req *http.Request) (string, string, error) {
	var (
		sessionCookie *http.Cookie
		sessionToken  string
		user_id       string
		username      string
		err           error
	)

	sessionCookie, err = req.Cookie(LoginSessionCookieName)
	if err != nil {
		return user_id, username, fmt.Errorf("couldn't find session cookie: %w", err)
	}

	err = validateSessionCookie(sessionCookie)
	if err != nil {
		return user_id, username, fmt.Errorf("couldn't validate session cookie: %w", err)
	}
	sessionToken = sessionCookie.Value

	stmt, err := database.DB.Prepare(
		`SELECT 
			u.id,
			u.username
		
		FROM Sessions s
		JOIN Users u ON s.user_id = u.id
		WHERE s.session_token = $1;
		`,
	)
	if err != nil {
		return user_id, username, fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()
	err = stmt.QueryRow(sessionToken).Scan(&user_id, &username)
	if err != nil {
		return user_id, username, fmt.Errorf("couldn't scan database entries to local server-side user variable: %w", err)
	}

	return user_id, username, err
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
		WHERE session_token = $1`)
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
