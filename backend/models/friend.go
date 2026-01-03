package models

import (
	"time"
)

type Friend struct {
	ID                  uint      `json:"id"`
	Name                string    `json:"name"`
	LastMeetupDate      time.Time `json:"last_meetup_date"`
	LastInteractionDate time.Time `json:"last_interaction_date"`
	Birthday            time.Time `json:"birthday"`
	ProfileImagePath    string    `json:"profile_image_path"`
	RelationshipTier    uint      `json:"relationship_tier"`
	CreatedAt           time.Time `json:"created_at"`
	UpdatedAt           time.Time `json:"updated_at"`
}
