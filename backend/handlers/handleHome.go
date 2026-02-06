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

type HomepageCalendarData = map[int][]models.Friend

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
		fmt.Println(urgentFriendsForTodayAndNextFiveDays)

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

		homepageCalendarData map[int][]models.Friend = make(map[int][]models.Friend)

		err error
	)

	// Get all friends who, by daysAhead days from now, will be passed their "best before" date
	friendsDueToExpire, err := getFriendsDueToExpire(user_id, daysAhead)
	if err != nil {
		return homepageCalendarData, fmt.Errorf("couldn't determine which friends are passed their 'best before' %d days from now: %w", daysAhead, err)
	}

	// Get all friends whos birthdays are this week
	friendsWithUpcomingBirthdays, err := getFriendsWithUpcomingBirthdays(user_id, daysAhead)
	if err != nil {
		return homepageCalendarData, fmt.Errorf("couldn't determine which friends have birthdays within the next %d days: %w", daysAhead, err)
	}

	// Eliminate friends who've been "completed" or "ignored" by the user
	cutoffDate := time.Now().AddDate(0, 0, -(totalDays + 1))
	friendsDueToExpire_FILTERED := []models.Friend{}
	for _, friend := range friendsDueToExpire {
		var (
			created_at time.Time
			err        error
		)
		stmt, err := database.DB.Prepare(`
			SELECT created_at
			FROM UserFriendUpdates
			WHERE user_id = ? AND friend_id = ?
			ORDER BY created_at DESC
			LIMIT 1;
		`)
		if err != nil {
			return homepageCalendarData, fmt.Errorf("couldn't prepare statement: %w", err)
		}
		err = stmt.QueryRow(user_id, friend.ID).Scan(&created_at)
		if err == sql.ErrNoRows {
			friendsDueToExpire_FILTERED = append(friendsDueToExpire_FILTERED, friend)
			continue
		}
		if err != nil {
			return homepageCalendarData, fmt.Errorf("couldn't execute statement: %w", err)
		}

		isActionOld := created_at.Before(cutoffDate)
		if isActionOld {
			friendsDueToExpire_FILTERED = append(friendsDueToExpire_FILTERED, friend)
		}
	}

	for _, friend := range friendsDueToExpire {
		fmt.Println(friend.Name)
	}
	fmt.Println()
	for _, friend := range friendsDueToExpire_FILTERED {
		fmt.Println(friend.Name)
	}
	fmt.Println()

	// Assign birthday friends to respective birthday dates
	for i := range totalDays {
		date := time.Now().AddDate(0, 0, i)
		homepageCalendarData[i] = []models.Friend{}

		for _, friend := range friendsWithUpcomingBirthdays {
			if friend.BirthdayMonth == int(date.Month()) && friend.BirthdayDay == date.Day() {
				homepageCalendarData[i] = append(homepageCalendarData[i], friend)
			}
		}
	}

	// For non-birthday friends
	// Sort by most urgent first
	sort.Slice(friendsDueToExpire_FILTERED, func(i, j int) bool {
		return friendsDueToExpire_FILTERED[i].RelationshipTier < friendsDueToExpire_FILTERED[j].RelationshipTier
	})
	// Distribute them throughout the week as evenly as possible
	day := 0
	for _, friend := range friendsDueToExpire_FILTERED {
		// Check if friend is already in calendar
		friendAlreadyInCalendar := false
		for _, existing := range homepageCalendarData[day] {
			if existing.ID == friend.ID {
				friendAlreadyInCalendar = true
				break
			}
		}

		if !friendAlreadyInCalendar {
			homepageCalendarData[day] = append(homepageCalendarData[day], friend)
		}

		day = (day + 1) % totalDays
	}

	return homepageCalendarData, err
}

func getFriendsDueToExpire[U database.SqlId](user_id U, daysAhead int) ([]models.Friend, error) {
	var (
		friends            []models.Friend
		friendsDueToExpire []models.Friend

		err error
	)

	stmt, err := database.DB.Prepare(`
		WITH RankedInteractions AS (
			SELECT
				InteractionsAttendees.friend_id,
				Interactions.date,
				ROW_NUMBER() OVER (
					PARTITION BY InteractionsAttendees.friend_id
					ORDER BY Interactions.date DESC
				) AS latest_rank
			FROM
				InteractionsAttendees
				JOIN Interactions ON Interactions.id = InteractionsAttendees.interaction_id
		)
		SELECT
			Friends.id,
			Friends.name,
			Friends.birthday_day,
			Friends.birthday_month,
			Images.filepath,
			RankedInteractions.date AS latest_interaction_date,
			Relationships.relationship_tier
		FROM
			Friends
			LEFT JOIN Images ON Friends.profile_image_id = Images.id
			LEFT JOIN Relationships ON Relationships.friend_id = Friends.id
			LEFT JOIN RankedInteractions ON RankedInteractions.friend_id = Friends.id 
				AND RankedInteractions.latest_rank = 1
		WHERE
			Relationships.user_id = ?
		ORDER BY latest_interaction_date DESC;
	`)
	if err != nil {
		return friendsDueToExpire, fmt.Errorf("couldn't prepare statement: %w", err)
	}
	rows, err := stmt.Query(user_id)
	if err == sql.ErrNoRows {
		return friendsDueToExpire, nil
	}
	if err != nil {
		return friendsDueToExpire, fmt.Errorf("couldn't query statement: %w", err)
	}

	for rows.Next() {
		var (
			friend models.Friend

			id                    int
			name                  string
			birthday_day          sql.NullInt64
			birthday_month        sql.NullInt64
			pfp_path              sql.NullString
			last_interaction_date sql.NullTime
			relationship_tier     sql.NullInt64
		)

		err = rows.Scan(
			&id,
			&name,
			&birthday_day,
			&birthday_month,
			&pfp_path,
			&last_interaction_date,
			&relationship_tier,
		)
		if err != nil {
			return friendsDueToExpire, fmt.Errorf("couldn't scan row to local variables: %w", err)
		}

		friend = models.Friend{ID: uint(id), Name: name}
		if birthday_day.Valid {
			friend.BirthdayDay = int(birthday_day.Int64)
		}
		if birthday_month.Valid {
			friend.BirthdayMonth = int(birthday_month.Int64)
		}
		if pfp_path.Valid {
			friend.ProfileImagePath = pfp_path.String
		}
		if last_interaction_date.Valid {
			friend.LastInteraction.Date = last_interaction_date.Time
		}
		if relationship_tier.Valid {
			friend.RelationshipTier = uint(relationship_tier.Int64)
		}

		friends = append(friends, friend)
	}

	for _, friend := range friends {
		var daysToExpire int

		switch friend.RelationshipTier {
		case 1: // inner clique
			daysToExpire = 3
		case 2: // close friends
			daysToExpire = 7
		case 3: // ordinary friends
			daysToExpire = 10
		case 4: // acquaintances
			daysToExpire = 14
		default:
			daysToExpire = 14
		}

		friendExpirationDate := friend.LastInteraction.Date.AddDate(0, 0, daysToExpire)
		friendExpiresSoon := friendExpirationDate.Before(time.Now().AddDate(0, 0, daysAhead+1))

		if friendExpiresSoon {
			friendsDueToExpire = append(friendsDueToExpire, friend)
		}
	}

	return friendsDueToExpire, nil
}

func getFriendsWithUpcomingBirthdays[U database.SqlId](user_id U, daysAhead int) ([]models.Friend, error) {
	var (
		friendsWithUpcomingBirthdays []models.Friend

		err error
	)

	stmt, err := database.DB.Prepare(`
		SELECT
			Friends.id,
			Friends.name,
			Friends.birthday_day,
			Friends.birthday_month,
			Images.filepath
		FROM
			Friends
			LEFT JOIN Images ON Friends.profile_image_id = Images.id
			LEFT JOIN Relationships ON Relationships.friend_id = Friends.id
		WHERE
			Relationships.user_id = ?;
	`)
	if err != nil {
		return friendsWithUpcomingBirthdays, fmt.Errorf("couldn't prepare statement: %w", err)
	}
	rows, err := stmt.Query(user_id)
	if err == sql.ErrNoRows {
		return friendsWithUpcomingBirthdays, nil
	}
	if err != nil {
		return friendsWithUpcomingBirthdays, fmt.Errorf("couldn't query statement: %w", err)
	}

	for rows.Next() {
		var (
			friend models.Friend

			id             int
			name           string
			birthday_day   sql.NullInt64
			birthday_month sql.NullInt64
			pfp_path       sql.NullString
		)

		err = rows.Scan(&id, &name, &birthday_day, &birthday_month, &pfp_path)
		if err != nil {
			return friendsWithUpcomingBirthdays, fmt.Errorf("couldn't scan row to local variables: %w", err)
		}

		friend = models.Friend{ID: uint(id), Name: name}
		if birthday_day.Valid {
			friend.BirthdayDay = int(birthday_day.Int64)
		}
		if birthday_month.Valid {
			friend.BirthdayMonth = int(birthday_month.Int64)
		}
		if pfp_path.Valid {
			friend.ProfileImagePath = pfp_path.String
		}
		if birthday_month.Valid && birthday_day.Valid {
			endOfUpcomingDays := time.Now().AddDate(0, 0, daysAhead)
			if birthday_month.Int64 <= int64(endOfUpcomingDays.Month()) && birthday_day.Int64 <= int64(endOfUpcomingDays.Day()) {
				friendsWithUpcomingBirthdays = append(friendsWithUpcomingBirthdays, friend)
			}
		}
	}

	return friendsWithUpcomingBirthdays, nil
}
