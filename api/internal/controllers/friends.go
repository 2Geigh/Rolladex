package controllers

import (
	"database/sql"
	"fmt"
	"rolladex/internal/database"
	"rolladex/internal/models"
)

func GetUrgentFriends(user_id uint) ([]models.Friend, error) {
	var (
		urgentFriends []models.Friend
		err           error
	)

	rows, err := database.DB.Query(
		`SELECT 
			Friends.id,
			Friends.name,
			Friends.profile_image_id
		FROM Friends 
		INNER JOIN Relationships
			ON Friends.id = Relationships.friend_id
		LEFT JOIN Interactions
			ON Relationships.user_id = Interactions.user_id
		LEFT JOIN InteractionsAttendees
			ON (
				InteractionsAttendees.interaction_id = Interactions.id
				AND
				InteractionsAttendees.friend_id = Friends.id
			)
		WHERE Relationships.user_id = $1
		ORDER BY Interactions.date ASC
		LIMIT 1;
		`, user_id)
	if err != nil {
		return urgentFriends, fmt.Errorf("execute database query failed: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var (
			friend models.Friend

			friend_id               sql.NullInt64
			friend_name             sql.NullString
			friend_profile_image_id sql.NullInt64

			err error
		)

		err = rows.Scan(&friend_id, &friend_name, &friend_profile_image_id)
		if err != nil {
			return urgentFriends, fmt.Errorf("scan result row to local variable failed: %w", err)
		}

		if friend_id.Valid {
			friend.ID = uint(friend_id.Int64)
		}

		if friend_name.Valid {
			friend.Name = friend_name.String
		}

		urgentFriends = append(urgentFriends, friend)
	}

	return urgentFriends, err
}
