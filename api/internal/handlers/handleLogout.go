package handlers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"rolladex/internal/database"
	"rolladex/internal/middleware"
	"rolladex/internal/util"
)

func Logout(w http.ResponseWriter, req *http.Request) {

	switch req.Method {

	case http.MethodGet:
		statusCode, err := logoutUser(w, req)
		if err != nil {
			util.ReportHttpError(err, w, "logout failed", statusCode)
		}

		http.Redirect(w, req, "/login", http.StatusSeeOther)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}

}

func logoutUser(w http.ResponseWriter, req *http.Request) (int, error) {
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
