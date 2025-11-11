package models

import (
	"context"
	"fmt"
	"log"
	"myfriends-backend/database"
	"myfriends-backend/util"

	"gorm.io/gorm"
)

type LastTime struct {
	Year  int
	Month int
	Day   int
}

type Friend struct {
	gorm.Model
	Name                string `json:"name"`
	Birthday            string `json:"birthday"`
	LastInteractionDate string `json:"last_interaction"`
	LastMeetupDate      string `json:"last_meetup"`
	// Meetup_plans             []Meetup  `json:"meetup_plans"`
}

func AddFriend(friend Friend) error {

	ctx := context.Background()

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

	// Automatically create `friends` table if it doesn't already exist
	err = DB.AutoMigrate(&Friend{})
	if err != nil {
		log.Fatal(fmt.Errorf("Could not account for a 'friends' table: %v", err))
	}
	fmt.Println("Database migrated successfully. Friends table created.")

	// Validate form data
	err = util.ValidateDate(friend.LastInteractionDate)
	if err != nil {
		return fmt.Errorf("Invalid date of last interaction: %v", err)
	}
	err = util.ValidateDate(friend.LastMeetupDate)
	if err != nil {
		return fmt.Errorf("Invalid date of last meetup: %v", err)
	}

	// Create a single record with result
	result := gorm.WithResult()
	err = gorm.G[Friend](DB, result).Create(ctx, &friend) // pass pointer of data to Create

	// Output
	fmt.Printf("Created friend (ID %v).\nAffected the following row(s): %v\nYielded result(s):\n%v",
		friend.ID,
		result.RowsAffected,
		result.Result)
	return err

}

// var AddFriend = database.Add_Factory(Friend)
