package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"rolladex-backend/database"
	"rolladex-backend/logic"
	"rolladex-backend/models"
	"rolladex-backend/util"
	"strconv"
)

func FriendStandalonePage(w http.ResponseWriter, req *http.Request) {

	util.SetCrossOriginResourceSharing(w, util.FrontendOrigin)
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

	case http.MethodDelete:
		_, err := validateSession(req)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't validate session", http.StatusUnauthorized)
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
		lastInteraction  sql.NullTime
		lastMeetup       sql.NullTime
	)

	tx, err := database.DB.Begin()
	if err != nil {
		return friend, fmt.Errorf("couldn't begin transaction: %w", err)
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(`
	SELECT
		f.id AS friend_id,
		f.name,
		f.birthday_month,
		f.birthday_day,
		i.filepath AS profile_image_path,
		r.relationship_tier,
		-- Last interaction (any type)
		(
			SELECT inter.date
			FROM Interactions inter
			JOIN InteractionsAttendees ia ON ia.interaction_id = inter.id
			WHERE inter.user_id = r.user_id AND ia.friend_id = f.id
		) AS last_interaction_date,
		-- Last meetup date (specifically type = 'meetup')
		(
			SELECT inter.date
			FROM Interactions inter
			JOIN InteractionsAttendees ia ON ia.interaction_id = inter.id
			WHERE inter.user_id = r.user_id AND ia.friend_id = f.id
				AND inter.interaction_type = 'meetup'
		) AS last_meetup_date
	FROM Relationships r
	JOIN Friends f ON f.id = r.friend_id
	LEFT JOIN Images i ON i.id = f.profile_image_id
	WHERE f.id = ?
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
		&lastInteraction,
		&lastMeetup,
	)
	if err != nil {
		return friend, fmt.Errorf("couldn't scan row: %w", err)
	}

	friend = models.Friend{
		ID:   uint(friend_id),
		Name: name,
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
	if lastInteraction.Valid {
		friend.LastInteraction.Date = lastInteraction.Time
	}
	if lastMeetup.Valid {
		friend.LastMeetup.Date = lastMeetup.Time
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
