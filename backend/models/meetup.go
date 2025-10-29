package models

import (
	"database/sql"

	"gorm.io/gorm"
)

type Meetup struct {
	gorm.Model
	// Time      time.Time `json:"time"`
	// Location  *string   `json:"location"`
	// Attendees []Friend  `json:"attendees"`
}

func CreateTable_Meetups(db *sql.DB) (sql.Result, error) {
	sql := `CREATE TABLE IF NOT EXISTS meetups (
		id INTEGER PRIMARY KEY
	);`

	return db.Exec(sql)
}
