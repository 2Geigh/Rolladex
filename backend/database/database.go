package database

import (
	"database/sql"
	"log"
)

var (
	DB *sql.DB
)

func InitDB() {
	DB, err := sql.Open("sqlite3", "./myFriends.db")
	if err != nil {
		log.Fatalf("Could not open database connection: %v", err)
	}

	log.Println("Connected to database.")
}
