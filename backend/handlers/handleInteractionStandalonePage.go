package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"rolladex-backend/database"
	"rolladex-backend/models"
	"rolladex-backend/util"
	"strconv"
	"time"
)

func InteractionStandalonePage(w http.ResponseWriter, req *http.Request) {

	util.SetCrossOriginResourceSharing(w)
	util.LogHttpRequest(req)

	var (
		uri                   string = req.URL.Path
		isFriendIdPathPresent bool   = len(uri) > len("/interactions/")
		isUriRouteValid       bool   = uri[:len("/interactions/")] == "/interactions/"
		isUriValid            bool   = isFriendIdPathPresent && isUriRouteValid
	)

	if !(isUriValid) {
		util.ReportHttpError(fmt.Errorf("invalid URI format"), w, "invalid URI syntax", http.StatusBadRequest)
		return
	}

	interactionIdStr := uri[len("/interactions/"):]
	interactionId, err := strconv.Atoi(interactionIdStr)
	if err != nil {
		util.ReportHttpError(err, w, "couldn't parse friend ID from URI", http.StatusBadRequest)
		return
	}

	switch req.Method {
	case http.MethodOptions:
		w.WriteHeader(http.StatusNoContent)
		return

	case http.MethodGet:

		_, err := validateSession(req)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't validate session", http.StatusUnauthorized)
			return
		}

		interaction, err := getInteraction(interactionId)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't get interaction", http.StatusInternalServerError)
			return
		}

		userJson, err := json.Marshal(interaction)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't marshal interaction data to JSON", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, err = w.Write(userJson)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't write interaction JSON data", http.StatusInternalServerError)
			return
		}

	// case http.MethodPut:
	// 	user_id, err := validateSession(req)
	// 	if err != nil {
	// 		util.ReportHttpError(err, w, "couldn't validate session", http.StatusUnauthorized)
	// 		return
	// 	}

	// 	reqBody, err := io.ReadAll(req.Body)
	// 	if err != nil {
	// 		util.ReportHttpError(err, w, "couldn't read request body", http.StatusBadRequest)
	// 		return
	// 	}

	// 	var updateData struct {
	// 		ID               int    `json:"id"`
	// 		Name             string `json:"name"`
	// 		RelationshipTier int    `json:"relationship_tier"`
	// 		BirthdayMonth    int    `json:"birthday_month"`
	// 		BirthdayDay      int    `json:"birthday_day"`
	// 	}
	// 	err = json.Unmarshal(reqBody, &updateData)
	// 	if err != nil {
	// 		util.ReportHttpError(err, w, "couldn't unmarshal interaction JSON data", http.StatusInternalServerError)
	// 		return
	// 	}

	// 	statusCode, err := updateFriend(updateData, user_id)
	// 	if err != nil {
	// 		util.ReportHttpError(err, w, "couldn't update interaction", statusCode)
	// 		return
	// 	}

	// 	w.WriteHeader(http.StatusOK)

	// case http.MethodDelete:
	// 	_, err := validateSession(req)
	// 	if err != nil {
	// 		util.ReportHttpError(err, w, "couldn't validate session", http.StatusUnauthorized)
	// 		return
	// 	}

	// 	err = deleteFriend(interactionId)
	// 	if err != nil {
	// 		util.ReportHttpError(err, w, "couldn't delete interaction", http.StatusInternalServerError)
	// 		return
	// 	}

	// 	w.WriteHeader(http.StatusOK)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func getInteraction[I database.SqlId](interaction_id I) (models.Interaction, error) {
	var (
		interaction models.Interaction

		ID              uint
		Date            time.Time
		Attendees       []models.Friend = []models.Friend{}
		InteractionType sql.NullString
		Name            sql.NullString
		Location        sql.NullString
	)

	stmt, err := database.DB.Prepare(`
		SELECT
			Interactions.id AS id,
			Interactions.date AS date,
			Interactions.interaction_type AS interaction_type,
			Interactions.name AS name,
			Interactions.location AS location
		FROM Interactions
		WHERE Interactions.id = ?;
    `)
	if err != nil {
		return interaction, fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()

	resultRow := stmt.QueryRow(interaction_id)
	err = resultRow.Scan(
		&ID,
		&Date,
		&InteractionType,
		&Name,
		&Location,
	)
	if err != nil {
		return interaction, fmt.Errorf("couldn't scan row: %w", err)
	}

	stmt, err = database.DB.Prepare(`
		SELECT
			Friends.id as friend_id,
			Friends.name as friend_name,
			Friends.birthday_month as birthday_month,
			Friends.birthday_day as birthday_day,
			Images.filepath as profile_image_path
		FROM InteractionsAttendees
			LEFT JOIN Friends ON Friends.id = InteractionsAttendees.friend_id
			LEFT JOIN Images ON Images.id = Friends.profile_image_id
		WHERE InteractionsAttendees.interaction_id = ?;
    `)
	if err != nil {
		return interaction, fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()

	rows, err := stmt.Query(interaction_id)
	if err != nil {
		return interaction, fmt.Errorf("couldn't query statement: %w", err)
	}

	for rows.Next() {
		var (
			attendee models.Friend

			id                 uint
			name               string
			birthday_month     sql.NullInt64
			birthday_day       sql.NullInt64
			profile_image_path sql.NullString
		)

		rows.Scan(
			&id,
			&name,
			&birthday_month,
			&birthday_day,
			&profile_image_path,
		)

		attendee = models.Friend{
			ID:   id,
			Name: name,
		}
		if birthday_month.Valid {
			attendee.BirthdayMonth = int(birthday_month.Int64)
		}
		if birthday_day.Valid {
			attendee.BirthdayDay = int(birthday_day.Int64)
		}
		if profile_image_path.Valid {
			attendee.ProfileImagePath = profile_image_path.String
		}

		Attendees = append(Attendees, attendee)
	}

	interaction = models.Interaction{
		ID:   ID,
		Date: Date,
	}
	if InteractionType.Valid {
		interaction.InteractionType = InteractionType.String
	}
	if Name.Valid {
		interaction.Name = Name.String
	}
	if Location.Valid {
		interaction.Location = Location.String
	}
	interaction.Attendees = Attendees

	return interaction, err
}

// func updateInteraction[U database.SqlId](updateData struct {
// 	ID               int    `json:"id"`
// 	Name             string `json:"name"`
// 	RelationshipTier int    `json:"relationship_tier"`
// 	BirthdayMonth    int    `json:"birthday_month"`
// 	BirthdayDay      int    `json:"birthday_day"`
// }, user_id U) (int, error) {
// 	var (
// 		statusCode = http.StatusOK
// 		err        error
// 	)

// 	tx, err := database.DB.Begin()
// 	if err != nil {
// 		return http.StatusInternalServerError, fmt.Errorf("couldn't begin transaction: %w", err)
// 	}
// 	defer tx.Rollback()

// 	stmt, err := tx.Prepare(`
// 								UPDATE Friends
// 								SET
// 									name = ?,
// 									birthday_month = ?,
// 									birthday_day = ?
// 								WHERE Friends.id = ?;

// 							`)
// 	if err != nil {
// 		return http.StatusInternalServerError, fmt.Errorf("couldn't prepare statement: %w", err)
// 	}
// 	defer stmt.Close()
// 	_, err = stmt.Exec(updateData.Name, updateData.BirthdayMonth, updateData.BirthdayDay, updateData.ID)
// 	if err != nil {
// 		return http.StatusInternalServerError, fmt.Errorf("couldn't execute statement: %w", err)
// 	}

// 	stmt, err = tx.Prepare(`
// 								UPDATE Relationships
// 								SET
// 									relationship_tier = ?
// 								WHERE
// 									Relationships.friend_id = ?
// 									AND Relationships.user_id = ?;
// 							`)
// 	if err != nil {
// 		return http.StatusInternalServerError, fmt.Errorf("couldn't prepare statement: %w", err)
// 	}
// 	defer stmt.Close()
// 	_, err = stmt.Exec(updateData.RelationshipTier, updateData.ID, user_id)
// 	if err != nil {
// 		return http.StatusInternalServerError, fmt.Errorf("couldn't execute statement: %w", err)
// 	}

// 	err = tx.Commit()
// 	if err != nil {
// 		return http.StatusInternalServerError, fmt.Errorf("couldn't commit transaction: %w", err)
// 	}
// 	return statusCode, err
// }

// func deleteInteraction(friend_id int) error {
// 	var (
// 		err error
// 	)

// 	tx, err := database.DB.Begin()
// 	if err != nil {
// 		return fmt.Errorf("couldn't begin transaction: %w", err)
// 	}
// 	defer tx.Rollback()

// 	stmt, err := tx.Prepare(`
// 		DELETE FROM Friends
// 		WHERE id = ?;
// 	`)
// 	if err != nil {
// 		return fmt.Errorf("couldn't prepare statment: %w", err)
// 	}
// 	defer stmt.Close()

// 	result, err := stmt.Exec(friend_id)
// 	if err != nil {
// 		return fmt.Errorf("couldn't execute statement: %w", err)
// 	}

// 	rowsAffected, err := result.RowsAffected()
// 	if err != nil {
// 		return fmt.Errorf("couldn't get statement execution result: %w", err)
// 	}

// 	err = tx.Commit()
// 	if err != nil {
// 		return fmt.Errorf("couldn't complete transaction: %w", err)
// 	}

// 	log.Printf(`Affected %d row(s)`, rowsAffected)
// 	return err
// }
