package database

import (
	"fmt"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func InitializeDB() (*gorm.DB, error) {

	// Establish database connection
	DB, err := gorm.Open(sqlite.Open("./database/myFriends.db"), &gorm.Config{})
	if err != nil {
		return DB, fmt.Errorf("Could not establish database connection: %v", err)
	}

	return DB, err
}

// func InitializeTables(db *gorm.DB) {

// 	var wg sync.WaitGroup

// 	wg.Add(1)
// 	wg.Go(func() {
// 		defer wg.Done()
// 		result, err := models.CreateTable_Users(db)
// 		fmt.Println(result)
// 		if err != nil {
// 			log.Fatalf("Could not create table: %v", err)
// 		}
// 	})

// 	wg.Add(1)
// 	wg.Go(func() {
// 		defer wg.Done()
// 		result, err := models.CreateTable_Friends(db)
// 		fmt.Println(result)
// 		if err != nil {
// 			log.Fatalf("Could not create table: %v", err)
// 		}
// 	})

// 	wg.Add(1)
// 	wg.Go(func() {
// 		defer wg.Done()
// 		result, err := models.CreateTable_Meetups(db)
// 		fmt.Println(result)
// 		if err != nil {
// 			log.Fatalf("Could not create table: %v", err)
// 		}
// 	})

// 	wg.Wait()

// }

// func VerifyUsersTable(db *gorm.DB) {
// 	rows, err := db.Query("SELECT * FROM users")
// 	if err != nil {
// 		log.Fatalf("Could not query users table: %v", err)
// 	}
// 	defer rows.Close()

// 	// Check if the table is empty
// 	if !rows.Next() {
// 		fmt.Println("Users table is empty or doesn't exist.")
// 		return
// 	}

// 	// Process the rows if any exist
// 	for {
// 		var id int
// 		var username, email, password string

// 		if err := rows.Scan(&id, &username, &email, &password); err != nil {
// 			break
// 		}

// 		fmt.Printf("User: %d, %s, %s, %s\n", id, username, email, password)
// 	}
// }

// func FindUser(username string, db *sql.DB) {

// 	var id int

// 	query := `SELECT id FROM users WHERE username = ?`
// 	row := db.QueryRow(query, username)

// 	err := row.Scan(&id)
// 	if err != nil {
// 		if err == sql.ErrNoRows {
// 			fmt.Println("No user found with that username.")
// 		} else {
// 			log.Fatalf("Query error: %v", err)
// 		}
// 	}

// }
