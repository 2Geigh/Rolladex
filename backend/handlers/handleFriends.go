package handlers

import (
	"encoding/json"
	"fmt"
	"math"
	"myfriends-backend/models"
	"myfriends-backend/util"
	"net/http"
	"time"
)

func Friends(w http.ResponseWriter, req *http.Request) {

}

func FriendsUrgent(w http.ResponseWriter, req *http.Request) {
	// CORS
	util.SetCrossOriginResourceSharing(w, util.FrontendOrigin)
	w.Header().Add("Access-Control-Allow-Credentials", "true")

	switch req.Method {

	case http.MethodGet:
		var topFiveUrgentFriends []models.Friend

		user_id, err := validateSession(req)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't validate session", http.StatusUnauthorized)
			return
		}

		topFiveUrgentFriends, err = getUrgentFriends(user_id)

		userJson, err := json.Marshal(topFiveUrgentFriends)
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

func getUrgentFriends(user_id string) ([]models.Friend, error) {
	var (
		friends                  []models.Friend
		maxNumberOfUrgentFriends                 = 5
		urgentFriends            []models.Friend = make([]models.Friend, 0, maxNumberOfUrgentFriends)
		err                      error
	)

	urgentFriends, err = sortByRelationshipUrgency(friends)
	if err != nil {
		return urgentFriends, fmt.Errorf("couldn't sort relationships by urgency: %w", err)
	}

	return urgentFriends, err
}

func sortByRelationshipUrgency(friends []models.Friend) ([]models.Friend, error) {
	var (
		// friendsTemplate            []models.Friend
		// friendKeysAndUrgencyValues map[models.Friend]int
		friendsSortedByUrgency []models.Friend
		err                    error
	)
	for _, friend := range friends {
		var (
			// urgency_score float64
			err error
		)
		// urgency_score, err = GetUrgencyScore(friend)
		if err != nil {
			return friendsSortedByUrgency, fmt.Errorf("couldn't get %s's urgency score: %w", friend.Name, err)
		}
	}

	return friendsSortedByUrgency, err
}

func GetUrgencyScore(friend models.Friend) (float64, error) {
	var (
		daysForMaxUrgency int
		urgencyScore      float64
		err               error
	)

	switch friend.RelationshipStatus {
	case (1): // "inner clique"
		daysForMaxUrgency = 8 // weekly
	case (2): // "close friends"
		daysForMaxUrgency = 32 // monthly
	case (3): // "ordinary friends"
		daysForMaxUrgency = 366 // 6-monthly-to-yearlys
	case (4): // "friends / acquaintances ('I know a guy' kinda friendships)"
		daysForMaxUrgency = 731 // 2-yearly
	}

	today := time.Now()
	timeSinceLastInteraction := today.Sub(friend.LastInteractionDate)
	daysSinceLastInteraction := math.Floor(timeSinceLastInteraction.Hours() / 24)
	if daysSinceLastInteraction < 0 {
		return urgencyScore, fmt.Errorf("incorrect calculation for days since last interaction (computed negative value)")
	}

	urgencyScore = daysSinceLastInteraction / float64(daysForMaxUrgency)

	return urgencyScore, err
}
