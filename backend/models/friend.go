package models

import (
	"time"
)

type Friend struct {
	ID               uint        `json:"id"`
	Name             string      `json:"name"`
	LastMeetup       Interaction `json:"last_meetup"`
	LastInteraction  Interaction `json:"last_interaction"`
	Birthday         time.Time   `json:"birthday"`
	ProfileImagePath string      `json:"profile_image_path"`
	RelationshipTier uint        `json:"relationship_tier"`
	CreatedAt        time.Time   `json:"created_at"`
	UpdatedAt        time.Time   `json:"updated_at"`
}
