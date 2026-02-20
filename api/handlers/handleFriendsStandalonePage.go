package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"rolladex-backend/database"
	"rolladex-backend/logic"
	"rolladex-backend/models"
	"rolladex-backend/util"
	"strconv"
	"time"
)

func FriendStandalonePage(w http.ResponseWriter, req *http.Request) {

	util.SetCrossOriginResourceSharing(w, req)
	util.LogHttpRequest(req)

	var (
		uri                   string = req.URL.Path
		isFriendIdPathPresent bool   = len(uri) > len("/friends/")
		isUriRouteValid       bool   = uri[:len("/friends/")] == "/friends/"
		isUriValid            bool   = isFriendIdPathPresent && isUriRouteValid
	)

	if !(isUriValid) {
		util.ReportHttpError(fmt.Errorf("invalid URI format"), w, "invalid URI syntax", http.StatusBadRequest)
		return
	}

	friendIdStr := uri[len("/friends/"):]
	friendId, err := strconv.Atoi(friendIdStr)
	if err != nil {
		util.ReportHttpError(err, w, "couldn't parse friend ID from URI", http.StatusBadRequest)
		return
	}

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

		friend, err := getFriend(friendId, user_id)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't get friend", http.StatusInternalServerError)
			return
		}

		userJson, err := json.Marshal(friend)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't marshal friend data to JSON", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, err = w.Write(userJson)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't write friend JSON data", http.StatusInternalServerError)
			return
		}

	case http.MethodPut:
		user_id, err := validateSession(req)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't validate session", http.StatusUnauthorized)
			return
		}

		reqBody, err := io.ReadAll(req.Body)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't read request body", http.StatusBadRequest)
			return
		}

		var updateData struct {
			ID               int    `json:"id"`
			Name             string `json:"name"`
			RelationshipTier int    `json:"relationship_tier"`
			BirthdayMonth    int    `json:"birthday_month"`
			BirthdayDay      int    `json:"birthday_day"`
		}
		err = json.Unmarshal(reqBody, &updateData)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't unmarshal friend JSON data", http.StatusInternalServerError)
			return
		}

		statusCode, err := updateFriend(updateData, user_id)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't update friend", statusCode)
			return
		}

		w.WriteHeader(http.StatusOK)

	case http.MethodDelete:
		user_id, err := validateSession(req)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't validate session", http.StatusUnauthorized)
			return
		}

		reqBody, err := io.ReadAll(req.Body)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't read request body", http.StatusInternalServerError)
			return
		}
		csrfToken := string(reqBody)
		isCsrfTokenValid, err := isCsrfTokenValid(csrfToken, user_id)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't validate CSRF token", http.StatusInternalServerError)
			return
		}
		if !isCsrfTokenValid {
			util.ReportHttpError(err, w, "invalid CSRF token provided", http.StatusBadRequest)
			return
		}

		err = deleteFriend(friendId)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't delete friend", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func getFriend(friend_id int, user_id string) (models.Friend, error) {
	var (
		friend models.Friend

		name             string
		birthdayMonth    sql.NullInt64
		birthdayDay      sql.NullInt64
		profileImagePath sql.NullString
		relationshipTier sql.NullInt64
		notes            sql.NullString

		lastInteractionId       int
		lastInteractionDate     time.Time
		lastInteractionLocation sql.NullString
		lastInteractionName     sql.NullString
	)

	tx, err := database.DB.Begin()
	if err != nil {
		return friend, fmt.Errorf("couldn't begin transaction: %w", err)
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`
	SELECT
		Friends.id AS friend_id,
		Friends.name as friend_name,
		Friends.birthday_month as birthday_month,
		Friends.birthday_day as birthday_day,
		Images.filepath AS profile_image_path,
		Relationships.relationship_tier as relationship_tier,
		Friends.notes as notes
	FROM Relationships
		LEFT JOIN Friends ON Friends.id = Relationships.friend_id
		LEFT JOIN Images ON Images.id = Friends.profile_image_id
	WHERE Friends.id = ?;
    `)
	if err != nil {
		return friend, fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()

	resultRow := stmt.QueryRow(friend_id)
	err = resultRow.Scan(
		&friend_id,
		&name,
		&birthdayMonth,
		&birthdayDay,
		&profileImagePath,
		&relationshipTier,
		&notes,
	)
	if err != nil {
		return friend, fmt.Errorf("couldn't scan row: %w", err)
	}

	stmt, err = tx.Prepare(`
		SELECT
			Interactions.id as interaction_id,
			Interactions.date as interaction_date,
			Interactions.location as interaction_location,
			Interactions.name as interaction_name
		FROM
			InteractionsAttendees
			LEFT JOIN Interactions ON InteractionsAttendees.interaction_id = Interactions.id
		WHERE InteractionsAttendees.friend_id = ?
		ORDER BY date DESC
		LIMIT 1;
    `)
	if err != nil {
		return friend, fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()

	resultRow = stmt.QueryRow(friend_id)
	err = resultRow.Scan(
		&lastInteractionId,
		&lastInteractionDate,
		&lastInteractionLocation,
		&lastInteractionName,
	)
	if err != nil {
		return friend, fmt.Errorf("couldn't scan row: %w", err)
	}

	friend = models.Friend{
		ID:   uint(friend_id),
		Name: name,
		LastInteraction: models.Interaction{
			ID:   uint(lastInteractionId),
			Date: lastInteractionDate,
		},
	}

	if birthdayMonth.Valid {
		friend.BirthdayMonth = int(birthdayMonth.Int64)
	}
	if birthdayDay.Valid {
		friend.BirthdayDay = int(birthdayDay.Int64)
	}
	if profileImagePath.Valid {
		friend.ProfileImagePath = profileImagePath.String
	}
	if relationshipTier.Valid {
		friend.RelationshipTier = uint(relationshipTier.Int64)
	}
	if notes.Valid {
		friend.Notes = notes.String
	}
	if lastInteractionLocation.Valid {
		friend.LastInteraction.Location = lastInteractionLocation.String
	}
	if lastInteractionName.Valid {
		friend.LastInteraction.Name = lastInteractionName.String
	}

	friend.RelationshipHealth, err = logic.GetRelationshipHealth(friend_id, user_id)
	if err != nil {
		return friend, fmt.Errorf("couldn't get relationship health: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return friend, fmt.Errorf("couldn't commit transaction: %w", err)
	}
	return friend, err
}

func updateFriend[U database.SqlId](updateData struct {
	ID               int    `json:"id"`
	Name             string `json:"name"`
	RelationshipTier int    `json:"relationship_tier"`
	BirthdayMonth    int    `json:"birthday_month"`
	BirthdayDay      int    `json:"birthday_day"`
}, user_id U) (int, error) {
	var (
		statusCode = http.StatusOK
		err        error
	)

	tx, err := database.DB.Begin()
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("couldn't begin transaction: %w", err)
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`
								UPDATE Friends
								SET
									name = ?,
									birthday_month = ?,
									birthday_day = ?
								WHERE Friends.id = ?;
									
							`)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()
	_, err = stmt.Exec(updateData.Name, updateData.BirthdayMonth, updateData.BirthdayDay, updateData.ID)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("couldn't execute statement: %w", err)
	}

	stmt, err = tx.Prepare(`
								UPDATE Relationships
								SET
									relationship_tier = ?
								WHERE
									Relationships.friend_id = ?
									AND Relationships.user_id = ?;
							`)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()
	_, err = stmt.Exec(updateData.RelationshipTier, updateData.ID, user_id)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("couldn't execute statement: %w", err)
	}

	err = tx.Commit()
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("couldn't commit transaction: %w", err)
	}
	return statusCode, err
}

func deleteFriend(friend_id int) error {
	var (
		err error
	)

	tx, err := database.DB.Begin()
	if err != nil {
		return fmt.Errorf("couldn't begin transaction: %w", err)
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`
		DELETE FROM Friends 
		WHERE id = ?;
	`)
	if err != nil {
		return fmt.Errorf("couldn't prepare statment: %w", err)
	}
	defer stmt.Close()

	result, err := stmt.Exec(friend_id)
	if err != nil {
		return fmt.Errorf("couldn't execute statement: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("couldn't get statement execution result: %w", err)
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("couldn't complete transaction: %w", err)
	}

	log.Printf(`Affected %d row(s)`, rowsAffected)
	return err
}
