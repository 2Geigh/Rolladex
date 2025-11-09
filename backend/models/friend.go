package models

import (
	"context"
	"fmt"
	"log"
	"myfriends-backend/database"

	"gorm.io/gorm"
)

type Friend struct {
	gorm.Model
	Name string `json:"name"`
	// Birthday                 util.Date `json:"birthday"`
	// Time_of_last_interaction time.Time `json:"time_of_last_interaction"`
	// Time_of_last_meetup      time.Time `json:"time_of_last_meetup"`
	// Meetup_plans             []Meetup  `json:"meetup_plans"`
}

// func CreateTable_Friends(db *sql.DB) (sql.Result, error) {
// 	sql := `CREATE TABLE IF NOT EXISTS friends (
// 		id INTEGER PRIMARY KEY,
// 		name VARCHAR(255) NOT NULL
// 	);`

// 	return db.Exec(sql)
// }

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
