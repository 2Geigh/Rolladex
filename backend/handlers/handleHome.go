package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"rolladex-backend/database"
	"rolladex-backend/models"
	"rolladex-backend/util"
	"sort"
	"time"
)

func Home(w http.ResponseWriter, req *http.Request) {
	util.LogHttpRequest(req)
	util.SetCrossOriginResourceSharing(w)

	switch req.Method {

	case http.MethodGet:

		user_id, err := validateSession(req)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't validate session", http.StatusUnauthorized)
			return
		}

		urgentFriendsForTodayAndNextFiveDays, err := getUrgentFriendsForTodayAndNextFiveDays(user_id)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't get upcoming urgent friends data", http.StatusInternalServerError)
			return
		}

		urgentFriendsForTodayAndNextFiveDaysJson, err := json.Marshal(urgentFriendsForTodayAndNextFiveDays)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't marshal upcoming urgent friends data to JSON", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, err = w.Write(urgentFriendsForTodayAndNextFiveDaysJson)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't write upcoming urgent friends JSON data", http.StatusInternalServerError)
			return
		}

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func getUrgentFriendsForTodayAndNextFiveDays[U database.SqlId](user_id U) (map[int][]models.Friend, error) {
	var (
		daysAhead int = 5
		totalDays int = daysAhead + 1

		allUrgentFriendsForDays map[int][]models.Friend = make(map[int][]models.Friend)

		err error
	)

	for i := 0; i < totalDays; i++ {
		date := time.Now().AddDate(0, 0, i)
		urgentFriends, err := getUrgentFriends(user_id, date)
		if err != nil {
			return allUrgentFriendsForDays, fmt.Errorf("couldn't get urgent friends: %w", err)
		}

		allUrgentFriendsForDays[i] = urgentFriends
	}

	return allUrgentFriendsForDays, err
}

func getUrgentFriends[U database.SqlId](user_id U, date time.Time) ([]models.Friend, error) {
	var (
		friends       []models.Friend = []models.Friend{}
		urgentFriends []models.Friend = []models.Friend{}

		err error
	)

	sqlQuery := `
					SELECT
						Friends.id as friend_id,
						Friends.name as friend_name,
						Friends.birthday_month as friend_birthday_month,
						Friends.birthday_day as friend_birthday_day,
						Images.filepath as profile_image_path,
						Relationships.relationship_tier as relationship_tier
					FROM Friends
					LEFT JOIN Relationships ON Relationships.friend_id = Friends.id
					LEFT JOIN Images on Images.id = Friends.profile_image_id
					WHERE Relationships.user_id = ?;
	`
	stmt, err := database.DB.Prepare(sqlQuery)
	if err != nil {
		return urgentFriends, fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()

	rows, err := stmt.Query(user_id)
	if err != nil {
		return urgentFriends, fmt.Errorf("couldn't execute statement: %w", err)
	}

	for rows.Next() {
		var (
			friend models.Friend

			birthdayMonth    sql.NullInt64
			birthdayDay      sql.NullInt64
			ProfileImagePath sql.NullString
			RelationshipTier sql.NullInt64
		)

		rows.Scan(
			&friend.ID,
			&friend.Name,
			&birthdayMonth,
			&birthdayDay,
			&ProfileImagePath,
			&RelationshipTier,
		)
		if birthdayMonth.Valid {
			friend.BirthdayMonth = int(birthdayMonth.Int64)
		}
		if birthdayDay.Valid {
			friend.BirthdayDay = int(birthdayDay.Int64)
		}
		if ProfileImagePath.Valid {
			friend.ProfileImagePath = ProfileImagePath.String
		}
		if RelationshipTier.Valid {
			friend.RelationshipTier = uint(RelationshipTier.Int64)
		}

		friends = append(friends, friend)
	}

	for _, friend := range friends {
		var (
			urgencyScore float64
		)

		daysSinceLastInteraction, err := models.GetDaysSinceLastInteraction(friend.ID, user_id)
		if err != nil {
			return urgentFriends, fmt.Errorf("couldn't get days since last interaction with %s: %w", friend.Name, err)
		}

		switch friend.RelationshipTier {
		case 1: // inner clique
			urgencyScore = daysSinceLastInteraction / 3
		case 2: // close friends
			urgencyScore = daysSinceLastInteraction / 7
		case 3: // ordinary friends
			urgencyScore = daysSinceLastInteraction / 10
		case 4: // acquaintances
			urgencyScore = daysSinceLastInteraction / 14
		default:
			urgencyScore = daysSinceLastInteraction / 14
		}

		friend.Urgency = urgencyScore
	}

	sort.Slice(friends, func(i, j int) bool {
		if friends[i].Urgency == friends[j].Urgency {
			return friends[i].RelationshipTier < friends[j].RelationshipTier // ascending
		}

		return friends[i].Urgency > friends[j].Urgency // descending
	})

	for index, friend := range friends {
		isBirthdayToday := date.Day() == friend.BirthdayDay && date.Month() == time.Month(friend.BirthdayMonth)

		if index == 0 {
			urgentFriends = append(urgentFriends, friend)
			continue
		} else if isBirthdayToday {
			urgentFriends = append(urgentFriends, friend)
			continue
		}
	}

	return urgentFriends, err
}
