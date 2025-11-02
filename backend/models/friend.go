package models

import (
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
