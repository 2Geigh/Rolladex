package models

import (
	"time"
)

type Friend struct {
	ID                 uint        `json:"id"`
	Name               string      `json:"name"`
	LastMeetup         Interaction `json:"last_meetup"`
	LastInteraction    Interaction `json:"last_interaction"`
	BirthdayMonth      int         `json:"birthday_month"`
	BirthdayDay        int         `json:"birthday_day"`
	ProfileImagePath   string      `json:"profile_image_path"`
	RelationshipTier   uint        `json:"relationship_tier"`
	RelationshipHealth float64     `json:"relationship_health"`
	CreatedAt          time.Time   `json:"created_at"`
	UpdatedAt          time.Time   `json:"updated_at"`
}
