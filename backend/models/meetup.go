package models

import (
	"time"
)

type Interaction struct {
	ID              uint      `json:"id"`
	Date            time.Time `json:"date"`
	UserID          uint      `json:"user_id"`
	FriendID        uint      `json:"friend_id"`
	InteractionType string    `json:"interaction_type"`
	Attendees       []Friend  `json:"attendees"`
	Name            string    `json:"name"`
	Location        string    `json:"location"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type InteractionAttendee struct {
	ID            uint      `json:"id"`
	IntearctionID uint      `json:"interaction_id"`
	FriendID      uint      `json:"friend_id"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}
