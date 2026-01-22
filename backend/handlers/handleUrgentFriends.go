package handlers

import (
	"encoding/json"
	"fmt"
	"myfriends-backend/logic"
	"myfriends-backend/models"
	"myfriends-backend/util"
	"net/http"
	"time"
)

func UrgentFriends(w http.ResponseWriter, req *http.Request) {

	util.SetCrossOriginResourceSharing(w, util.FrontendOrigin)
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

func filterMostUrgentFriends(friends []models.Friend, user_id string) ([]models.Friend, error) {
	var (
		mostUrgentFriends []models.Friend
		mostUrgentFriend  struct {
			friend       models.Friend
			urgencyScore float64
		}

		err error
	)

	today := time.Now()
	for index, friend := range friends {
		isBirthdayToday := friend.BirthdayMonth == int(today.Month()) && friend.BirthdayDay == today.Day()
		if isBirthdayToday {
			mostUrgentFriends = append(mostUrgentFriends, friend)
			continue
		}

		if index < 1 {
			mostUrgentFriend.friend = friend
			mostUrgentFriend.urgencyScore, err = logic.GetRelationshipUrgency(int(friend.ID), user_id)
			if err != nil {
				return mostUrgentFriends, fmt.Errorf("couldn't get first urgency score: %w", err)
			}
			continue
		}

		urgencyScore, err := logic.GetRelationshipUrgency(int(friend.ID), user_id)
		if err != nil {
			return mostUrgentFriends, fmt.Errorf("couldn't get urgency score: %w", err)
		}
		if urgencyScore > mostUrgentFriend.urgencyScore {
			mostUrgentFriend.friend = friend
			mostUrgentFriend.urgencyScore = urgencyScore
		}
	}

	mostUrgentFriends = append([]models.Friend{mostUrgentFriend.friend}, mostUrgentFriends...)
	return mostUrgentFriends, err
}
