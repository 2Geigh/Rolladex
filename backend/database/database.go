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

