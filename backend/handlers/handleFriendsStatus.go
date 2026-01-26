package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"rolladex-backend/database"
	"rolladex-backend/util"
	"time"
)

var (
	AllowedActions []string = []string{"complete", "ignore"}
)

func FriendsStatus(w http.ResponseWriter, req *http.Request) {
	util.LogHttpRequest(req)
	util.SetCrossOriginResourceSharing(w, util.FrontendOrigin)

	switch req.Method {
	case http.MethodPost:

		user_id, err := validateSession(req)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't validate session", http.StatusUnauthorized)
			return
		}

		var requestBody struct {
			Friend_id int    `json:"friend_id"`
			Action    string `json:"action"`
		}
		err = json.NewDecoder(req.Body).Decode(&requestBody)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't unmarshall request body", http.StatusBadRequest)
			return
		}

		err = updateFriendStatus(requestBody.Friend_id, user_id, requestBody.Action)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't update friend status", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func updateFriendStatus[F database.SqlId, U database.SqlId](friend_id F, user_id U, action string) error {

	isActionAllowed := false
	for _, value := range AllowedActions {
		if action == value {
			isActionAllowed = true
			break
		}
	}
	if !isActionAllowed {
		return fmt.Errorf("invalid action value provided")
	}

	tx, err := database.DB.Begin()
	if err != nil {
		return fmt.Errorf("couldn't begin transaction: %w", err)
	}
	defer tx.Rollback()

	sqlQuery := `
					INSERT INTO UserFriendUpdates
						(user_id, friend_id, action) VALUES (?, ?, ?);
				`
	stmt, err := tx.Prepare(sqlQuery)
	if err != nil {
		return fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()
	_, err = stmt.Exec(user_id, friend_id, action)
	if err != nil {
		return fmt.Errorf("couldn't execute statement: %w", err)
	}

	if action == "ignore" {
		err = tx.Commit()
		if err != nil {
			return fmt.Errorf("couldn't complete transaction")
		}
		return err
	}

	sqlQuery = `
				INSERT INTO Interactions
					(date, user_id) VALUES (?,?);
				`
	stmt, err = tx.Prepare(sqlQuery)
	if err != nil {
		return fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()
	result, err := stmt.Exec(time.Now().UTC(), user_id)
	if err != nil {
		return fmt.Errorf("couldn't execute statement: %w", err)
	}
	interaction_id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("couldn't get id of newly inserted interaction: %w", err)
	}

	sqlQuery = `
					INSERT INTO InteractionsAttendees
						(interaction_id, friend_id) VALUES (?,?);
					`
	stmt, err = tx.Prepare(sqlQuery)
	if err != nil {
		return fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()
	result, err = stmt.Exec(interaction_id, friend_id)
	if err != nil {
		return fmt.Errorf("couldn't execute statement: %w", err)
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("couldn't complete transaction")
	}
	return err
}
