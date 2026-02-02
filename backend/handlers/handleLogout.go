package handlers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"rolladex-backend/database"
	"rolladex-backend/util"
)

func Logout(w http.ResponseWriter, req *http.Request) {

	// CORS
	util.SetCrossOriginResourceSharing(w, req)

	switch req.Method {

	case http.MethodOptions:
		w.WriteHeader(http.StatusNoContent)

	case http.MethodGet:
		logoutUser(w, req)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}

}

func logoutUser(w http.ResponseWriter, req *http.Request) {
	cookie, err := req.Cookie(LoginSessionCookieName)
	if err != nil {
		util.ReportHttpError(err, w, "login session cookie not recognized", http.StatusBadRequest)
		return
	}

	err = deleteSession(cookie.Value)
	if err != nil {
		util.ReportHttpError(err, w, "could not delete login session", http.StatusInternalServerError)
		return
	}
	deleteCookie(cookie, w)

	w.WriteHeader(http.StatusOK)
}

func deleteCookie(cookie *http.Cookie, w http.ResponseWriter) {
	cookie.MaxAge = -1
	http.SetCookie(w, cookie)
}

func deleteSession(sessionToken string) error {
	var (
		tx       *sql.Tx // for atomic compliance
		username string
		result   sql.Result
		err      error
	)

	tx, err = database.DB.Begin()
	if err != nil {
		return fmt.Errorf("begin tx: %w", err)
	}
	defer tx.Rollback() // for durability compliance

	// Get user_id from session_id
	err = tx.QueryRow(`
        SELECT u.username FROM Sessions s 
        JOIN Users u ON s.user_id = u.id 
        WHERE s.session_token = ?`, sessionToken).Scan(&username)
	if err != nil {
		return nil // Returning an actual error here is kinda pointless because that means they're already logged out / weren't even signed in, meaning its not really a failure
		return fmt.Errorf("could not scan username from database to local variable username: %w", err)
	}

	// Delete session row in database
	result, err = tx.Exec("DELETE FROM Sessions WHERE session_token = ?", sessionToken)
	if err != nil {
		return fmt.Errorf("could not delete session: %w", err)
	}
	rowsAffected, _ := result.RowsAffected()

	// Commit the transaction
	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("commit tx: %w", err)
	}

	log.Println(fmt.Sprintf("\033[3m%s\033[3m logged out, affecting %d row(s)", username, rowsAffected))
	return err
}
