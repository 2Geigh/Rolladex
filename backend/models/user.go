package models

import (
	"database/sql"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `json:"username"`
	Email    string `json:"email"` // Pointer allows for null values
	Password string `json:"password"`
	// Birthday                 util.Date       `json:"birthday"` // Pointer allows for null values
	// Time_without_interaction time.Time       `json:"time_without_interaction"`
	// Time_without_meetup      time.Time       `json:"time_without_meetup"`
	// Meetup_plans             []Meetup        `json:"meetup_plans"`
	// RecievesNotifications    map[string]bool `json:"receivesNotifications"`
}

func CreateTable_Users(db *sql.DB) (sql.Result, error) {
	sql := `CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY,
		username VARCHAR(255) NOT NULL,
		password LONGTEXT
	);`

	return db.Exec(sql)
}
