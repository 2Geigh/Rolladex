package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"rolladex-backend/database"
	"rolladex-backend/util"
	"time"
)

func FriendsInteractions(w http.ResponseWriter, req *http.Request) {
	util.LogHttpRequest(req)
	util.SetCrossOriginResourceSharing(w, util.FrontendOrigin)

	switch req.Method {
	case http.MethodOptions:
		w.WriteHeader(http.StatusOK)
		return

	case http.MethodPut:
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

		var requestBody struct {
			Friend_id              int       `json:"friend_id"`
			NewLastInteractionDate time.Time `json:"new_last_interaction_date"`
		}
		err = json.Unmarshal(reqBody, &requestBody)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't unmarshall request body", http.StatusBadRequest)
			return
		}
		log.Println(requestBody)

		err = updateLastInteractionWithFriend(requestBody.Friend_id, user_id, requestBody.NewLastInteractionDate)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't update last interaction with friend", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		return

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}
}

func updateLastInteractionWithFriend[F database.SqlId, U database.SqlId](friend_id F, user_id U, new_last_interaction_date time.Time) error {

	tx, err := database.DB.Begin()
	if err != nil {
		return fmt.Errorf("couldn't begin transaction: %w", err)
	}
	defer tx.Rollback()

	sqlQuery := `
					INSERT INTO Interactions
						(date, user_id) VALUES (?, ?);
				`
	stmt, err := tx.Prepare(sqlQuery)
	if err != nil {
		return fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()
	result, err := stmt.Exec(new_last_interaction_date, user_id)
	if err != nil {
		return fmt.Errorf("couldn't execute statement: %w", err)
	}
	interaction_id, err := result.LastInsertId()
	if err != nil {
		return fmt.Errorf("couldn't get id of inserted interaction: %w", err)
	}

	sqlQuery = `
				INSERT INTO InteractionsAttendees
					(interaction_id, friend_id)
					VALUES (?,?);
				`
	stmt, err = tx.Prepare(sqlQuery)
	if err != nil {
		return fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()
	_, err = stmt.Exec(interaction_id, friend_id)
	if err != nil {
		return fmt.Errorf("couldn't execute statement: %w", err)
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("couldn't complete transaction")
	}
	return err
}
