package database

import (
	"database/sql"
	"fmt"
	"log"
	"myfriends-backend/models"
	"sync"

	_ "modernc.org/sqlite"
)

func InitializeDB() (*sql.DB, error) {

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

func InitializeTables(db *sql.DB) {

	var wg sync.WaitGroup

	wg.Add(1)
	wg.Go(func() {
		defer wg.Done()
		result, err := models.CreateTable_Users(db)
		fmt.Println(result)
		if err != nil {
			log.Fatalf("Could not create table: %v", err)
		}
	})

	wg.Add(1)
	wg.Go(func() {
		defer wg.Done()
		result, err := models.CreateTable_Friends(db)
		fmt.Println(result)
		if err != nil {
			log.Fatalf("Could not create table: %v", err)
		}
	})

	wg.Add(1)
	wg.Go(func() {
		defer wg.Done()
		result, err := models.CreateTable_Meetups(db)
		fmt.Println(result)
		if err != nil {
			log.Fatalf("Could not create table: %v", err)
		}
	})

	wg.Wait()

}

func VerifyUsersTable(db *sql.DB) {
	rows, err := db.Query("SELECT * FROM users")
	if err != nil {
		log.Fatalf("Could not query users table: %v", err)
	}
	defer rows.Close()

	// Check if the table is empty
	if !rows.Next() {
		fmt.Println("Users table is empty or doesn't exist.")
		return
	}

	// Process the rows if any exist
	for {
		var id int
		var username, email, password string

		if err := rows.Scan(&id, &username, &email, &password); err != nil {
			break
		}

		fmt.Printf("User: %d, %s, %s, %s\n", id, username, email, password)
	}
}

func FindUser(username string, db *sql.DB) {

	var id int

	query := `SELECT id FROM users WHERE username = ?`
	row := db.QueryRow(query, username)

	err := row.Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("No user found with that username.")
		} else {
			log.Fatalf("Query error: %v", err)
		}
	}

}
