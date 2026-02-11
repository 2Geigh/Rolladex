package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"rolladex-backend/database"
	"rolladex-backend/models"
	"rolladex-backend/util"
	"time"
)

func InteractionsThisMonth(w http.ResponseWriter, req *http.Request) {
	// CORS
	util.SetCrossOriginResourceSharing(w, req)

	switch req.Method {
	case http.MethodOptions:
		w.WriteHeader(http.StatusNoContent)
		return

	case http.MethodGet:

		user_id, err := validateSession(req)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't validate session", http.StatusUnauthorized)
			return
		}

		thisMonthsInteractions, err := getThisMonthsInteractions(user_id)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't get last month's interactions", http.StatusInternalServerError)
			return
		}

		userJson, err := json.Marshal(thisMonthsInteractions)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't marshal user data to JSON", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, err = w.Write(userJson)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't write user JSON data", http.StatusInternalServerError)
			return
		}

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func getThisMonthsInteractions(user_id string) ([]models.Interaction, error) {
	var (
		// thisMonth              string
		thisMonthsInteractions []models.Interaction
		// attendeeIDs            []int
		// attendees              []models.Friend

		err error
	)

	// now := time.Now()
	// firstDayOfCurrentMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	// lastDayOfCurrentMonth := firstDayOfCurrentMonth.AddDate(0, 1, -1)

	tx, err := database.DB.Begin()
	if err != nil {
		return thisMonthsInteractions, fmt.Errorf("couldn't begin transaction: %w", err)
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`
	SELECT
		Interactions.id,
		Interactions.date,
		Interactions.interaction_type,
		Interactions.location,
		Interactions.name AS interaction_name,
		Friends.birthday,
		Friends.id,
		Friends.name AS friend_name,
		Images.filepath
	FROM Interactions
	LEFT JOIN InteractionsAttendees ON Interactions.id=InteractionsAttendees.interaction_id
	LEFT JOIN Friends ON InteractionsAttendees.friend_id=Friends.id
	LEFT JOIN Images ON Friends.profile_image_id=Images.id
	`)
	if err != nil {
		return thisMonthsInteractions, fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()
	rows, err := stmt.Query(user_id)
	if err != nil {
		return thisMonthsInteractions, fmt.Errorf("couldn't execute query: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var (
			interaction_id       int
			interaction_date     time.Time
			interaction_type     sql.NullString
			interaction_location sql.NullString
			interaction_name     sql.NullString
			friend_birthday      sql.NullTime
			friend_id            int
			friend_name          string
			profile_image_path   sql.NullString
		)

		err = rows.Scan(&interaction_id, &interaction_date, &interaction_type, &interaction_location, &interaction_name, &friend_birthday, &friend_name, &profile_image_path)
		if err != nil {
			return thisMonthsInteractions, fmt.Errorf("couldn't scan rows into local variables: %w", err)
		}

		interaction := models.Interaction{
			ID:   uint(interaction_id),
			Date: interaction_date,
		}
		if interaction_type.Valid {
			interaction.InteractionType = interaction_type.String
		}
		if interaction_location.Valid {
			interaction.Location = interaction_location.String
		}
		if interaction_name.Valid {
			interaction.Name = interaction_name.String
		}

		friend := models.Friend{
			ID:   uint(friend_id),
			Name: friend_name,
		}
		if profile_image_path.Valid {
			friend.ProfileImagePath = profile_image_path.String
		}

		thisMonthsInteractions = append(thisMonthsInteractions, interaction)
	}
	err = rows.Err()
	if err != nil {
		return thisMonthsInteractions, fmt.Errorf("rows error: %w", err)
	}

	tx.Commit()
	return thisMonthsInteractions, err
}

func getInteractionsByMonth(user_id string, date time.Time) ([]models.Interaction, error) {
	var (
		interactionsFromTheMonth []models.Interaction

		err error
	)

	tx, err := database.DB.Begin()
	if err != nil {
		return interactionsFromTheMonth, fmt.Errorf("couldn't begin transaction: %w", err)
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`
		SELECT
			Relationships.friend_id,
			Relationships.relationship_tier,
			Friends.name,
			Friends.birthday,
			Images.filepath AS profile_image_path,
			Interactions.date AS last_interaction_date
		FROM Relationships
		LEFT JOIN (
			SELECT user_id, friend_id, date
			FROM Interactions
			GROUP BY user_id, friend_id
			HAVING date = MAX(date)
		) Interactions ON Relationships.user_id = Interactions.user_id AND Relationships.friend_id = Interactions.friend_id
		LEFT JOIN Friends ON Friends.id = Relationships.friend_id
		LEFT JOIN Images ON Friends.profile_image_id = Images.id
		WHERE Relationships.user_id = ?
	`)
	if err != nil {
		return interactionsFromTheMonth, fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()
	rows, err := stmt.Query(user_id)
	if err != nil {
		return interactionsFromTheMonth, fmt.Errorf("couldn't execute query: %w", err)
	}
	defer rows.Close()

	// 	for rows.Next() {
	// 		var (
	// 			friend_id             int
	// 			name                  string
	// 			relationship_tier     sql.NullInt64
	// 			birthday              sql.NullTime
	// 			profile_image_path    sql.NullString
	// 			last_interaction_date sql.NullTime
	// 		)

	// 		err = rows.Scan(&friend_id, &relationship_tier, &name, &birthday, &profile_image_path, &last_interaction_date)
	// 		if err != nil {
	// 			return friends, fmt.Errorf("couldn't scan rows into local variables: %w", err)
	// 		}

	// 		friend := models.Friend{
	// 			ID:   uint(friend_id),
	// 			Name: name,
	// 		}
	// 		if birthday.Valid {
	// 			friend.Birthday = birthday.Time
	// 		}
	// 		if profile_image_path.Valid {
	// 			friend.ProfileImagePath = profile_image_path.String
	// 		}
	// 		if last_interaction_date.Valid {
	// 			friend.LastInteractionDate = last_interaction_date.Time
	// 		}
	// 		if relationship_tier.Valid {
	// 			friend.RelationshipTier = uint(relationship_tier.Int64)
	// 		}

	// 		friends = append(friends, friend)
	// 	}
	// 	err = rows.Err()
	// 	if err != nil {
	// 		return friends, fmt.Errorf("rows error: %w", err)
	// 	}

	// tx.Commit()
	return interactionsFromTheMonth, err
}
