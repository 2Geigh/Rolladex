package database

import (
	"context"
	"fmt"
	"log"
	"reflect"

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

func CloseDB(DB *gorm.DB) error {

	var err error

	sqlDB, err := DB.DB()
	if err != nil {
		log.Fatalf("Failed to get generic database object: %v", err)
	}

	err = sqlDB.Close()
	if err != nil {
		log.Fatalf("Failed to close database connection: %v", err)
	}

	return err

}

func Add_Factory[T any](model T) func(model T) error {

	return func(model T) error {
		ctx := context.Background()

		// Open database
		DB, err := InitializeDB()
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

		// Automatically create `friends` table if it doesn't already exist
		err = DB.AutoMigrate(model)
		if err != nil {
			log.Fatal(fmt.Errorf("Could not account for a 'friends' table: %v", err))
		}
		fmt.Println("Database migrated successfully. Friends table created.")

		// Create a single record with result
		result := gorm.WithResult()
		err = gorm.G[T](DB, result).Create(ctx, &model) // pass pointer of data to Create

		// Output
		fmt.Printf("Created %v.\nAffected %v rows.\nResult(s): %v\n",
			fmt.Sprint(reflect.TypeOf(model)),
			result.RowsAffected,
			result.Result)
		return err
	}

}
