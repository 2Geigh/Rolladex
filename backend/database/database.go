package database

import (
	"database/sql"
	"fmt"

	_ "modernc.org/sqlite"
)

func InitDB() (*sql.DB, error) {

	// Establish database connection
	DB, err := sql.Open("sqlite", "./myFriends.db")
	if err != nil {
		return DB, fmt.Errorf("Could not establish database connection: %v", err)
	}

	// Get database version
	var sqliteVersion string
	err = DB.QueryRow("select sqlite_version()").Scan(&sqliteVersion)
	if err != nil {
		return DB, fmt.Errorf("Could not get SQLite version: %v", err)
	}

	return DB, err

}
