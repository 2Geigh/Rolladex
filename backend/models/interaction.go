package models

import (
	"database/sql"
	"fmt"
	"rolladex-backend/database"
	"time"
)

type Interaction struct {
	ID              uint      `json:"id"`
	Date            time.Time `json:"date"`
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

func GetLastInteractionDate[F database.SqlId, U database.SqlId](friend_id F, user_id U) (time.Time, error) {
	var (
		lastInteractionDate time.Time
		err                 error
	)

	sqlQuery := `
					SELECT date
					FROM
						Interactions
						LEFT JOIN InteractionsAttendees
					WHERE friend_id = ? AND user_id = ?
					ORDER BY date DESC
					LIMIT 1;
					`

	err = database.DB.QueryRow(sqlQuery, friend_id, user_id).Scan(&lastInteractionDate)
	if err == sql.ErrNoRows {
		return lastInteractionDate, nil
	} else if err != nil {
		return lastInteractionDate, fmt.Errorf("couldn't scan last interaction date to local variable: %w", err)
	}

	return lastInteractionDate, err
}

func GetDaysSinceLastInteraction[F database.SqlId, U database.SqlId](friend_id F, user_id U) (float64, error) {
	var (
		daysSinceLastInteractionDate float64

		lastInteractionDate time.Time

		err error
	)

	lastInteractionDate, err = GetLastInteractionDate(friend_id, user_id)
	if err != nil {
		return daysSinceLastInteractionDate, fmt.Errorf("couldn't get last interaction date: %w", err)
	}

	today := time.Now()
	timeSinceLastInteractionDate := today.Sub(lastInteractionDate)
	daysSinceLastInteractionDate = timeSinceLastInteractionDate.Hours() / 24

	return daysSinceLastInteractionDate, err
}
