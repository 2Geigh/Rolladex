package api

import (
	"database/sql"
	"log"
	"rolladex/internal/database"
	"time"
)

func DeleteExpiredSessions() {
	logError := func(message string, err error) {
		log.Printf("couldn't delete expired user session(s): %s: %v", message, err)
	}

	for {
		time.Sleep(20 * time.Minute)

		result, err := database.DB.Exec(`
			DELETE
			FROM Sessions
			WHERE expires_at < NOW() OR is_revoked = TRUE;
		`)
		if err != nil && err != sql.ErrNoRows {
			logError("couldn't execute query", err)
			continue
		}

		rowsAffected, err := result.RowsAffected()
		if err != nil {
			logError("couldn't get number of rows affected", err)
		}

		log.Printf("deleteed invalid user sessions, affecting %d rows", rowsAffected)
	}
}
