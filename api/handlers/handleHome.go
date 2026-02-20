package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"rolladex-backend/database"
	"rolladex-backend/models"
	"rolladex-backend/util"
	"time"
)

type Notification struct {
	Date      time.Time `json:"date"`
	Text      string    `json:"text"`
	Friend_id int       `json:"friend_id"`
}

type HomepageContent struct {
	TodaysFriends []models.Friend `json:"todaysFriends"`
	Notifications []Notification  `json:"notifications"`
}

func Home(w http.ResponseWriter, req *http.Request) {
	util.LogHttpRequest(req)
	util.SetCrossOriginResourceSharing(w, req)

	switch req.Method {

	case http.MethodGet:

		user_id, err := validateSession(req)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't validate session", http.StatusUnauthorized)
			return
		}

		homepageContent, err := homepageContent(user_id)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't get homepage content", http.StatusInternalServerError)
			return
		}

		homepageContentJson, err := json.Marshal(homepageContent)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't marshal homepage content to JSON", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, err = w.Write(homepageContentJson)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't write upcoming urgent friends JSON data", http.StatusInternalServerError)
			return
		}

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func homepageContent[U database.SqlId](user_id U) (HomepageContent, error) {
	var (
		daysAheadForNotifications = 14
	)

	todaysFriends, err := todaysFriends(user_id)
	if err != nil {
		return HomepageContent{}, fmt.Errorf("couldn't get today's friends: %w", err)
	}

	notifications, err := notifications(user_id, daysAheadForNotifications)
	if err != nil {
		return HomepageContent{TodaysFriends: todaysFriends}, fmt.Errorf("couldn't get notifications for the next %d days: %w", daysAheadForNotifications, err)
	}

	return HomepageContent{TodaysFriends: todaysFriends, Notifications: notifications}, nil
}

func todaysFriends[U database.SqlId](user_id U) ([]models.Friend, error) {
	var (
		todaysFriends []models.Friend
	)

	stmt, err := database.DB.Prepare(`
		SELECT
			Friends.id AS friend_id,
			Friends.name AS friend_name,
			Friends.birthday_day,
			Friends.birthday_month,
			Relationships.relationship_tier,
			Images.filepath,
			DATEDIFF (CURRENT_DATE, RecentInteractions.interaction_date) as daysSinceLastInteraction
		FROM
			Relationships
			JOIN Friends ON Friends.id = Relationships.friend_id
			JOIN Images ON Friends.profile_image_id = Images.id
			LEFT JOIN (
				SELECT
					InteractionsAttendees.friend_id,
					MAX(Interactions.date) AS interaction_date
				FROM
					InteractionsAttendees
					JOIN Interactions ON Interactions.id = InteractionsAttendees.interaction_id
				GROUP BY
					InteractionsAttendees.friend_id
			) AS RecentInteractions ON RecentInteractions.friend_id = Friends.id
		WHERE
			Relationships.user_id = ?
		LIMIT 3;
	`)
	if err != nil {
		return todaysFriends, fmt.Errorf("couldn't prepare statement: %w", err)
	}

	rows, err := stmt.Query(user_id)
	if err != nil {
		return todaysFriends, fmt.Errorf("couldn't query statement: %w", err)
	}

	for rows.Next() {
		var (
			friend models.Friend

			id                       int
			name                     string
			birthdayDay              sql.NullInt64
			birthdayMonth            sql.NullInt64
			relationshipTier         sql.NullInt64
			pfpPath                  sql.NullString
			daysSinceLastInteraction sql.NullInt64
		)

		err := rows.Scan(&id, &name, &birthdayDay, &birthdayMonth, &relationshipTier, &pfpPath, &daysSinceLastInteraction)
		if err != nil {
			return todaysFriends, fmt.Errorf("couldn't scan row values to local variables: %w", err)
		}

		friend = models.Friend{ID: uint(id), Name: name}
		if birthdayDay.Valid {
			friend.BirthdayDay = int(birthdayDay.Int64)
		}
		if birthdayMonth.Valid {
			friend.BirthdayMonth = int(birthdayMonth.Int64)
		}
		if relationshipTier.Valid {
			friend.RelationshipTier = uint(relationshipTier.Int64)
		}
		if pfpPath.Valid {
			friend.ProfileImagePath = pfpPath.String
		}
		if daysSinceLastInteraction.Valid {
			friend.DaysSinceLastInteraction = int(daysSinceLastInteraction.Int64)
		}

		todaysFriends = append(todaysFriends, friend)
	}

	return todaysFriends, nil
}

func notifications[U database.SqlId](user_id U, daysAhead int) ([]Notification, error) {
	var (
		notifications []Notification
	)

	// Get all birthdays that are between today and today+daysAhead
	stmt, err := database.DB.Prepare(`
		SELECT
			f.id,
			f.name,
			f.birthday_month,
			f.birthday_day
		FROM
			Friends f
		JOIN Relationships r ON r.friend_id = f.id
		WHERE
			r.user_id = ?
			AND (
				-- Check current year instance
				DATE(CONCAT(
					YEAR(CURRENT_DATE), 
					'-', 
					f.birthday_month, 
					'-', 
					f.birthday_day
				)) BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL ? DAY)
				OR
				-- Check next year instance (handles Dec-Jan wrap)
				DATE(CONCAT(
					YEAR(CURRENT_DATE) + 1, 
					'-', 
					f.birthday_month, 
					'-', 
					f.birthday_day
				)) BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL ? DAY)
			);
	`)
	if err != nil {
		return notifications, fmt.Errorf("couldn't prepare statement: %w", err)
	}

	rows, err := stmt.Query(user_id, daysAhead, daysAhead)
	if err != nil {
		return notifications, fmt.Errorf("couldn't query statement: %w", err)
	}

	for rows.Next() {
		var (
			notification Notification

			friend_id      uint
			name           string
			birthday_day   sql.NullInt64
			birthday_month sql.NullInt64

			date time.Time
			text string
		)

		err := rows.Scan(&friend_id, &name, &birthday_month, &birthday_day)
		if err != nil {
			return notifications, fmt.Errorf("couldn't scan row values to local variables: %w", err)
		}
		text = fmt.Sprintf("%s's birthday! 🎂", name)
		if birthday_month.Valid && birthday_day.Valid {
			date = time.Date(time.Now().Year(), time.Month(birthday_month.Int64), int(birthday_day.Int64), 0, 0, 0, 0, time.Now().Location())
			notification = Notification{Date: date, Text: text, Friend_id: int(friend_id)}
			notifications = append(notifications, notification)
		}

	}

	return notifications, nil
}
