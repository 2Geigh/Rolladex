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

func CloseDB(DB *sql.DB) error {
	var err error


}
