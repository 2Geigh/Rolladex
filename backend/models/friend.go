package models

import (
	"context"
	"fmt"
	"log"
	"myfriends-backend/database"
	"myfriends-backend/util"
	"time"

	"gorm.io/gorm"
)

type LastTime struct {
	Year  int
	Month int
	Day   int
}

type Friend struct {
	gorm.Model
	Name             string     `json:"name"`
	LastInteraction  *time.Time `json:"last_interaction"`
	LastMeetup       *time.Time `json:"last_meetup"`
	MeetupPlans      *[]Meetup  `json:"meetup_plans"`
	Birthday         *time.Time `json:"birthday"`
	ProfileImagePath *string    `json:"profile_image_path"`
	Alerts           *[]string  `json:"alerts"`
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
	defer database.CloseDB(DB)

	// Automatically create `friends` table if it doesn't already exist
	err = DB.AutoMigrate(&Friend{})
	if err != nil {
		return fmt.Errorf("could not account for a 'friends' table: %v", err)
	}
	fmt.Println("Database migrated successfully. Friends table created.")

	// Validate form data
	if friend.LastInteractionDate != "" {
		_, err = util.IsValidDate(friend.LastInteractionDate)
		if err != nil {
			return fmt.Errorf("invalid date of last interaction: %v", err)
		}
	}
	if friend.LastMeetupDate != "" {
		_, err = util.IsValidDate(friend.LastMeetupDate)
		if err != nil {
			return fmt.Errorf("invalid date of last meetup: %v", err)
		}
	}

	// Create a single record with result
	result := gorm.WithResult()
	err = gorm.G[Friend](DB, result).Create(ctx, &friend) // pass pointer of data to Create

	// Output
	fmt.Printf("Created friend (ID %v).\nAffected %v row(s).\n",
		friend.ID,
		result.RowsAffected)
	return err

}

func DeleteFriend(friend Friend) error {

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
		return fmt.Errorf("could not account for a 'friends' table: %v", err)
	}
	fmt.Println("Database migrated successfully. Friends table created.")

	// Validate form data
	_, err = util.IsValidDate(friend.LastInteractionDate)
	if err != nil {
		return fmt.Errorf("invalid date of last interaction: %v", err)
	}
	_, err = util.IsValidDate(friend.LastMeetupDate)
	if err != nil {
		return fmt.Errorf("invalid date of last meetup: %v", err)
	}

	// Delete database entry by ID
	rows, err := gorm.G[Friend](DB).Where("id = ?", friend.ID).Delete(ctx)

	// Output
	log.Printf("Deleted %v from database. Affected %d row(s).",
		friend.Name,
		rows)
	return err

}

func GetFriends() ([]Friend, error) {

	var (
		friends []Friend
		err     error
	)

	// Open database
	DB, err := database.InitializeDB()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	log.Println("Database initialized successfully.")

	// Close database as the main function's last operation
	defer database.CloseDB(DB)

	// Automatically create `friends` table if it doesn't already exist
	err = DB.AutoMigrate(&Friend{})
	if err != nil {
		return friends, fmt.Errorf("could not account for a 'friends' table: %v", err)
	}
	log.Println("Database migrated successfully. Friends table created.")

	// Get all records
	result := DB.Find(&friends)
	// SELECT * FROM users;

	// Log results
	log.Printf("Found %d users", result.RowsAffected) // returns found records count, equals `len(users)`
	if result.Error != nil {
		return friends, result.Error
	}

	return friends, err

}

// var AddFriend = database.Add_Factory(Friend)
