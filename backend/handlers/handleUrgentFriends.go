package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"rolladex-backend/database"
	"rolladex-backend/logic"
	"rolladex-backend/models"
	"rolladex-backend/util"
	"time"
)

type UrgentFriendAndStatus struct {
	Friend models.Friend `json:"friend"`
	Status string        `json:"status"`
}

func UrgentFriends(w http.ResponseWriter, req *http.Request) {

	util.SetCrossOriginResourceSharing(w, req)
	util.LogHttpRequest(req)

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

		friends, err := getFriends(user_id)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't get friend", http.StatusInternalServerError)
			return
		}

		mostUrgentFriends, err := filterMostUrgentFriends(friends, user_id)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't filter most urgent friends", http.StatusInternalServerError)
			return
		}

		mostUrgentFriendsJson, err := json.Marshal(mostUrgentFriends)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't marshal most urgent friends data to JSON", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, err = w.Write(mostUrgentFriendsJson)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't write most urgent friends JSON data", http.StatusInternalServerError)
			return
		}

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func filterMostUrgentFriends(friends []models.Friend, user_id string) ([]UrgentFriendAndStatus, error) {
	var (
		mostUrgentFriendsWithStatus []UrgentFriendAndStatus
		mostUrgentFriend            struct {
			friend       models.Friend
			urgencyScore float64
			status       string
		}

		err error
	)

	today := time.Now()
	for index, friend := range friends {
		status, err := getTodaysFriendStatus(friend.ID, user_id)
		if err != nil {
			return mostUrgentFriendsWithStatus, fmt.Errorf("couldnt get urgent friend's status: %w", err)
		}
		if status != "" {
			continue
		}

		isBirthdayToday := friend.BirthdayMonth == int(today.Month()) && friend.BirthdayDay == today.Day()
		if isBirthdayToday {
			mostUrgentFriendsWithStatus = append(mostUrgentFriendsWithStatus, UrgentFriendAndStatus{Friend: friend, Status: status})
			continue
		}

		if index < 1 {
			mostUrgentFriend.friend = friend
			mostUrgentFriend.urgencyScore, err = logic.GetRelationshipUrgency(int(friend.ID), user_id)
			if err != nil {
				return mostUrgentFriendsWithStatus, fmt.Errorf("couldn't get first urgency score: %w", err)
			}
			continue
		}

		urgencyScore, err := logic.GetRelationshipUrgency(int(friend.ID), user_id)
		if err != nil {
			return mostUrgentFriendsWithStatus, fmt.Errorf("couldn't get urgency score: %w", err)
		}
		if urgencyScore > mostUrgentFriend.urgencyScore {
			mostUrgentFriend.friend = friend
			mostUrgentFriend.urgencyScore = urgencyScore
			mostUrgentFriend.status = status
		}

	}

	mostUrgentFriendsWithStatus = append([]UrgentFriendAndStatus{{Friend: mostUrgentFriend.friend, Status: mostUrgentFriend.status}}, mostUrgentFriendsWithStatus...)

	return mostUrgentFriendsWithStatus, err
}

func getTodaysFriendStatus[F database.SqlId, U database.SqlId](friend_id F, user_id U) (string, error) {
	var (
		status string

		created_at time.Time
		action     string
	)

	tx, err := database.DB.Begin()
	if err != nil {
		return status, fmt.Errorf("couldn't begin transaction: %w", err)
	}
	defer tx.Rollback()

	sqlQuery := `
					SELECT created_at, action
					FROM UserFriendUpdates
					WHERE
						UserFriendUpdates.user_id = ?
						AND UserFriendUpdates.friend_id = ?
					ORDER BY created_at DESC
					LIMIT 1;
				`
	stmt, err := tx.Prepare(sqlQuery)
	if err != nil {
		return status, fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()
	err = stmt.QueryRow(user_id, friend_id).Scan(&created_at, &action)
	if err == sql.ErrNoRows {
		return status, nil
	}
	if err != nil {
		return status, fmt.Errorf("couldn't execute statement: %w", err)
	}

	if !(util.DateEqual(created_at, time.Now().UTC())) {
		return status, nil
	}

	status = action
	err = tx.Commit()
	if err != nil {
		return status, fmt.Errorf("couldn't complete transaction")
	}
	return status, err
}
