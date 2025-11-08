package main

import (
	"fmt"
	"log"
	"myfriends-backend/database"
	"myfriends-backend/handlers"
	"net/http"
)

func main() {

	// Open database
	DB, err := database.InitializeDB()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	fmt.Println("Database initialized successfully.")

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

	// Routes
	http.HandleFunc("/", handlers.HandleRoot)

	// Start server
	log.Fatal(http.ListenAndServe(":3000", nil))
}
