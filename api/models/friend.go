package models

import (
	"database/sql"
	"fmt"
	"rolladex-backend/database"
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
	Urgency            float64     `json:"urgency"`
	Notes              string      `json:"notes"`
	CreatedAt          time.Time   `json:"created_at"`
	UpdatedAt          time.Time   `json:"updated_at"`
}

func GetRelationshipTier(friend_id int, user_id string) (int, error) {
	var (
		relationshipTier int
		err              error
	)

	sqlQuery := `
					SELECT relationship_tier
					FROM Relationships
					WHERE friend_id = ? AND user_id = ?
				`
	stmt, err := database.DB.Prepare(sqlQuery)
	if err != nil {
		return relationshipTier, fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()

	err = stmt.QueryRow(friend_id, user_id).Scan(&relationshipTier)
	if err == sql.ErrNoRows {
		return relationshipTier, fmt.Errorf("friend of id %d has no relationship with user of id %s: %w", friend_id, user_id, err)
	}
	if err != nil {
		return relationshipTier, fmt.Errorf("couldn't scan relationship tier to local variable: %w", err)
	}

	return relationshipTier, err
}

func GetBirthday(friend_id int) (int, int, error) {
	var (
		birthdayMonth int
		birthdayDay   int

		err error
	)

	sqlQuery := `
					SELECT birthday_month, birthday_day
					FROM Friends
					WHERE friend_id = ?;
				`
	stmt, err := database.DB.Prepare(sqlQuery)
	if err != nil {
		return birthdayMonth, birthdayDay, fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()

	err = stmt.QueryRow(friend_id).Scan(&birthdayMonth, &birthdayDay)
	if err == sql.ErrNoRows {
		return birthdayMonth, birthdayDay, fmt.Errorf("friend of id %d has no birthday entry: %w", friend_id, err)
	}
	if err != nil {
		return birthdayMonth, birthdayDay, fmt.Errorf("couldn't scan relationship tier to local variable: %w", err)
	}

	return birthdayMonth, birthdayDay, err
}
