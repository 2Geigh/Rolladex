package models

import (
	"time"

	"gorm.io/gorm"
)

type Meetup struct {
	gorm.Model
	Date      time.Time  `json:"date"`
	Attendees []int      `json:"attendees"`
	Name      *string    `json:"name"`
	Time      *time.Time `json:"time"`
	Location  *string    `json:"location"`
}
