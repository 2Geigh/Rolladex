package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"rolladex-backend/database"
	"rolladex-backend/util"
)

func FriendsNotes(w http.ResponseWriter, req *http.Request) {
	util.LogHttpRequest(req)
	util.SetCrossOriginResourceSharing(w)

	switch req.Method {
	case http.MethodOptions:
		w.WriteHeader(http.StatusOK)
		return

	case http.MethodPut:
		_, err := validateSession(req)
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
			FriendId int    `json:"id"`
			Notes    string `json:"notes"`
		}
		err = json.Unmarshal(reqBody, &requestBody)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't unmarshall request body", http.StatusBadRequest)
			return
		}

		err = updateFriendNotes(requestBody.FriendId, requestBody.Notes)
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

func updateFriendNotes[F database.SqlId](friend_id F, notes string) error {

	tx, err := database.DB.Begin()
	if err != nil {
		return fmt.Errorf("couldn't begin transaction: %w", err)
	}
	defer tx.Rollback()

	sqlQuery := `
					UPDATE Friends
					SET notes = ?
					WHERE Friends.id = ?;
				`
	stmt, err := tx.Prepare(sqlQuery)
	if err != nil {
		return fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()
	_, err = stmt.Exec(notes, friend_id)
	if err != nil {
		return fmt.Errorf("couldn't execute statement: %w", err)
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("couldn't complete transaction")
	}
	return err
}
