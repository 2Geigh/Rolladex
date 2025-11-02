package main

import (
	"log"
	"myfriends-backend/database"
)

func main() {

	// Open database
	DB, err := database.InitializeDB()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}

	// Close database as the main function's last operation
	defer func() {
		sqlDB, err := DB.DB()
		if err != nil {
			log.Fatalf("Failed to get generic database object: %v", err)
		}

		err = sqlDB.Close()
		if err != nil {
			log.Fatalf("Failed to close database connection: %v", err)
		}

	}()

}
