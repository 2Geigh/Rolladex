package logic

import (
	"fmt"
	"myfriends-backend/database"
)

func GetRelationshipHealth(friend_id int, user_id string) (float64, error) {
	var (
		relationshipHealth float64
		err                error
	)

	tx, err := database.DB.Begin()
	if err != nil {
		return relationshipHealth, fmt.Errorf("couldn't begin transaction: %w", err)
	}
	defer tx.Rollback()

	sqlQuery := `
					SELECT date
					FROM Interactions
					WHERE friend_id = ? AND user_id = ?
					ORDER BY date DESC
					LIMIT 1;
					`
	stmt, err := tx.Prepare(sqlQuery)
	if err != nil {
		return relationshipHealth, fmt.Errorf("couldn't prepare query: %w", err)
	}
	defer stmt.Close()

	err = stmt.query``

	return relationshipHealth, err
}
