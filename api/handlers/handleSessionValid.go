package handlers

import (
	"crypto/rand"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"rolladex-backend/database"
	"rolladex-backend/models"
	"rolladex-backend/util"
	"strconv"
	"time"
)

var (
	LoginSessionCookieName = "myFriends_session_token"
)

type SessionValidationResponse struct {
	User  models.User `json:"user"`
	Token string      `json:"token"`
}

func SessionValid(w http.ResponseWriter, req *http.Request) {

	// CORS
	util.SetCrossOriginResourceSharing(w, req)

	switch req.Method {

	case http.MethodGet:
		user_id, err := validateSession(req)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't validate session", http.StatusUnauthorized)
			return
		}

		user, err := sessionUser(user_id)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't find user data", http.StatusInternalServerError)
			return
		}

		token := csrfToken()
		err = storeCsrfTokenInDatabase(token, user_id)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't store CSRF token in database", http.StatusInternalServerError)
		}

		sessionData := SessionValidationResponse{User: user, Token: token}
		sessionDataJson, err := json.Marshal(sessionData)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't marshal user data to JSON", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		_, err = w.Write(sessionDataJson)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't write user JSON data", http.StatusInternalServerError)
			return
		}

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func validateSession(req *http.Request) (string, error) {
	var (
		sessionCookie *http.Cookie
		sessionToken  string
		user_id       string
		err           error
	)

	sessionCookie, err = req.Cookie(LoginSessionCookieName)
	if err != nil {
		return user_id, fmt.Errorf("couldn't find session cookie: %w", err)
	}

	err = validateSessionCookie(sessionCookie)
	if err != nil {
		return user_id, fmt.Errorf("couldn't validate session cookie: %w", err)
	}
	sessionToken = sessionCookie.Value

	stmt, err := database.DB.Prepare(`
		SELECT u.id
		FROM Sessions s
		JOIN Users u ON s.user_id = u.id
		WHERE s.session_token = ?;`,
	)
	if err != nil {
		return user_id, fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()
	err = stmt.QueryRow(sessionToken).Scan(&user_id)
	if err != nil {
		return user_id, fmt.Errorf("couldn't scan database entries to local server-side user variable: %w", err)
	}

	return user_id, err
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

func sessionUser(user_id string) (models.User, error) {
	var (
		user models.User

		username         sql.NullString
		email            sql.NullString
		profile_image_id sql.NullInt64
		birthday_month   sql.NullInt64
		birthday_day     sql.NullInt64
		created_at       sql.NullTime

		err error
	)

	user_id_int, err := strconv.ParseInt(user_id, 10, 64)
	if err != nil {
		return user, err
	}
	user.ID = uint(user_id_int)

	tx, err := database.DB.Begin()
	if err != nil {
		return user, fmt.Errorf("couldn't begin transaction: %w", err)
	}
	defer tx.Rollback()
	stmt, err := tx.Prepare(`
		SELECT username, email, profile_image_id, birthday_month, birthday_day, created_at
		FROM Users
		WHERE id = ?;`,
	)
	if err != nil {
		return user, fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()
	err = stmt.QueryRow(user_id).Scan(&username, &email, &profile_image_id, &birthday_month, &birthday_day, &created_at)
	if err != nil {
		return user, fmt.Errorf("couldn't scan database entries to local server-side user variable: %w", err)
	}

	if username.Valid {
		user.Username = username.String
	}
	if email.Valid {
		user.Email = models.Email(email.String)
	}
	if profile_image_id.Valid {
		user.ProfileImageID = uint(profile_image_id.Int64)
	}
	if birthday_month.Valid {
		user.BirthdayMonth = int(birthday_month.Int64)
	}
	if birthday_day.Valid {
		user.BirthdayDay = int(birthday_day.Int64)
	}
	if created_at.Valid {
		user.CreatedAt = created_at.Time
	}

	tx.Commit()
	return user, err
}

func csrfToken() string {
	token := make([]byte, 100)
	rand.Read(token)
	return base64.URLEncoding.EncodeToString(token)
}

func storeCsrfTokenInDatabase[U database.SqlId](token string, user_id U) error {

	// Clear database of any existing tokens for this user if necessary
	stmt, err := database.DB.Prepare(`
		DELETE
		FROM CsrfTokens
		WHERE CsrfTokens.user_id = ?;
		`)
	if err != nil {
		return fmt.Errorf("couldn't prepare statment: %w", err)
	}
	_, err = stmt.Exec(user_id)
	if err != nil {
		return fmt.Errorf("couldn't execute statement: %w", err)
	}

	// Add new token to database
	stmt, err = database.DB.Prepare(`
		INSERT INTO CsrfTokens (user_id, value) VALUES (?, ?);
		`)
	if err != nil {
		return fmt.Errorf("couldn't prepare statement: %w", err)
	}
	_, err = stmt.Exec(user_id, token)
	if err != nil {
		return fmt.Errorf("couldn't execute statement: %w", err)
	}

	return nil
}
