package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"myfriends-backend/database"
	"myfriends-backend/models"
	"myfriends-backend/util"
	"net/http"
	"slices"
	"sort"
	"time"
	"unicode/utf8"
)

type GetFriendsSortedByColumnParams struct {
	numberOfFriendsPerPage string
	pageNumber             string
	sortBy                 string
}

type ColumnNamesToSortFriendsBy struct {
	name                  string
	last_interaction_date string
	last_meetup_date      string
	birthday              string
	relationship_tier     string
}

type AddFriendFormData struct {
	Name                   string    `json:"name"`
	Last_interaction_date  time.Time `json:"last_interaction_date"`
	Relationship_tier_code int       `json:"relationship_tier_code"`
	BirthdayMonth          int       `json:"birthday_month"`
	BirthdayDay            int       `json:"birthday_day"`
}

var (
	maxNumberOfUrgentFriends   = 5
	columnNamesToSortFriendsBy = ColumnNamesToSortFriendsBy{
		"name",
		"last_interaction_date",
		"last_meetup_date",
		"birthday",
		"relationship_tier",
	}
)

func Friends(w http.ResponseWriter, req *http.Request) {

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

		getFriendsSortedByColumnParams := GetFriendsSortedByColumnParams{
			sortBy: req.URL.Query().Get("sortby"),
		}

		friends, err := getFriendsSortedByColumn(user_id, getFriendsSortedByColumnParams.sortBy)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't get list of friends", http.StatusInternalServerError)
			return
		}

		userJson, err := json.Marshal(friends)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't marshal friends data to JSON", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, err = w.Write(userJson)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't write friends JSON data", http.StatusInternalServerError)
			return
		}

	case http.MethodPost:
		var (
			addFriendFormData AddFriendFormData
		)

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

		err = json.Unmarshal(reqBody, &addFriendFormData)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't unmarshall request body", http.StatusInternalServerError)
			return
		}

		statusCode, err := addFriend(user_id, addFriendFormData)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't add friend", statusCode)
			return
		}

		w.WriteHeader(http.StatusOK)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func addFriend(user_id string, formData AddFriendFormData) (int, error) {
	var (
		name                 string    = formData.Name
		lastInteractionDate  time.Time = formData.Last_interaction_date
		relationshipTierCode int       = formData.Relationship_tier_code
		birthdayMonth                  = formData.BirthdayMonth
		birthdayDay                    = formData.BirthdayDay

		MAX_NAME_LENGTH int = 64

		err error
	)

	if util.IsEmpty(name) {
		return http.StatusBadRequest, fmt.Errorf("name field can't be empty")
	} else if utf8.RuneCountInString(name) > MAX_NAME_LENGTH {
		return http.StatusBadRequest, fmt.Errorf("name can't be longer than %d characters", MAX_NAME_LENGTH)
	}

	today := time.Now()
	if lastInteractionDate.After(today) {
		return http.StatusBadRequest, fmt.Errorf("last interaction date can't be in the future")
	}

	if relationshipTierCode < 1 {
		return http.StatusBadRequest, fmt.Errorf("invalid relationship tier")
	} else if relationshipTierCode > 4 {
		relationshipTierCode = 4 // acquaintance
	}

	if birthdayMonth != 0 && birthdayDay != 0 {
		if birthdayMonth > 12 || birthdayMonth < 0 {
			return http.StatusBadRequest, fmt.Errorf("invalid birthday month")
		}
		if birthdayDay < 0 || birthdayDay > 31 {
			return http.StatusBadRequest, fmt.Errorf("invalid birthday day")
		}
		if birthdayMonth == 2 && birthdayDay > 29 {
			return http.StatusBadRequest, fmt.Errorf("invalid birthday day")
		}
		if (birthdayMonth == 4 || birthdayMonth == 6 || birthdayMonth == 9 || birthdayMonth == 11) && (birthdayDay > 30) {
			return http.StatusBadRequest, fmt.Errorf("invalid birthday day")
		}
	}

	tx, err := database.DB.Begin()
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("couldn't begin transaction: %w", err)
	}
	defer tx.Rollback()

	// Friends
	stmtFriend, err := tx.Prepare(`INSERT INTO Friends (name, birthday_month, birthday_day) VALUES (?, ?, ?)`)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("couldn't prepare friend insert statement: %w", err)
	}
	defer stmtFriend.Close()
	result, err := stmtFriend.Exec(name, birthdayMonth, birthdayDay)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("couldn't execute friend insert statement: %w", err)
	}
	friendID, err := result.LastInsertId()
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("couldn't get last insert ID: %w", err)
	}

	// Relationships
	stmtRelationship, err := tx.Prepare(`INSERT INTO Relationships (user_id, friend_id, relationship_tier) VALUES (?, ?, ?)`)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("couldn't prepare relationship insert statement: %w", err)
	}
	defer stmtRelationship.Close()
	_, err = stmtRelationship.Exec(user_id, friendID, relationshipTierCode)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("couldn't execute relationship insert statement: %w", err)
	}

	//  Interactions
	stmtInteraction, err := tx.Prepare(`INSERT INTO Interactions (date, user_id) VALUES (?, ?);`)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf(("couldn't prepare statment: %w"), err)
	}
	defer stmtInteraction.Close()
	result, err = stmtInteraction.Exec(lastInteractionDate, user_id)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("couldn't execute statement: %w", err)
	}
	interactionID, err := result.LastInsertId()
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("couldn't get last insert ID: %w", err)
	}

	// InteractionsAttendees
	stmtInteractionsAttendees, err := tx.Prepare(`INSERT INTO InteractionsAttendees (interaction_id, friend_id) VALUES (?, ?);`)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf(("couldn't prepare statment: %w"), err)
	}
	defer stmtInteractionsAttendees.Close()
	_, err = stmtInteractionsAttendees.Exec(interactionID, friendID)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("couldn't execute statement: %w", err)
	}

	err = tx.Commit()
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("couldn't commit transaction: %w", err)
	}
	return http.StatusOK, err
}

func FriendsUrgent(w http.ResponseWriter, req *http.Request) {
	// CORS
	util.SetCrossOriginResourceSharing(w, util.FrontendOrigin)

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

		urgentFriends, err := getUrgentFriends(user_id)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't get list of urgent friends", http.StatusInternalServerError)
			return
		}

		userJson, err := json.Marshal(urgentFriends)
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

func getFriendsSortedByColumn(user_id string, sortBy string) ([]models.Friend, error) {
	var (
		friends  []models.Friend
		sqlQuery string
		OrderBy  string

		err error
	)

	switch sortBy {
	case "name":
		OrderBy = `ORDER BY name COLLATE NOCASE ASC`
	case "relationship_tier":
		OrderBy = `ORDER BY relationship_tier DESC`
	case "last_interaction_date":
		OrderBy = `ORDER BY last_interaction_date DESC`
	case "birthday":
		OrderBy = `ORDER BY birthday_month ASC, birthday_day ASC`
	case "created_at":
		OrderBy = `ORDER BY friend_created_at DESC`
	default:
		OrderBy = `ORDER BY name COLLATE NOCASE ASC`
	}

	sqlQuery = fmt.Sprintf(`
							WITH LatestInteractions AS (
														SELECT 
															Interactions.id AS interaction_id,
															Interactions.name AS interaction_name,
															Interactions.date AS interaction_date,
															Interactions.location AS interaction_location,
															Interactions.interaction_type AS interaction_type,
															InteractionsAttendees.friend_id AS friend_id,
															ROW_NUMBER() OVER (PARTITION BY InteractionsAttendees.friend_id ORDER BY Interactions.date DESC) AS rn
														FROM
															Interactions
														LEFT JOIN InteractionsAttendees ON Interactions.id = InteractionsAttendees.interaction_id
														WHERE
															Interactions.user_id = ?
							)

							SELECT
								Friends.id AS friend_id,
								Images.filepath AS pfp_path,
								Friends.name AS name,
								Relationships.relationship_tier AS relationship_tier,
								Friends.birthday_month AS birthday_month,
								Friends.birthday_day AS birthday_day,
								Friends.created_at AS friend_created_at,
								LatestInteractions.interaction_date as last_interaction_date,
								LatestInteractions.interaction_name,
								LatestInteractions.interaction_id
							FROM Friends
							LEFT JOIN Images ON Friends.profile_image_id = Images.id
							LEFT JOIN Relationships ON Relationships.friend_id = Friends.id
							LEFT JOIN LatestInteractions ON LatestInteractions.friend_id = Friends.id AND LatestInteractions.rn = 1
							WHERE Relationships.user_id = ?
							%s;`, OrderBy)

	tx, err := database.DB.Begin()
	if err != nil {
		return friends, fmt.Errorf("couldn't begin transaction: %w", err)
	}
	defer tx.Rollback()

	stmt, err := tx.Prepare(sqlQuery)
	if err != nil {
		return friends, fmt.Errorf("couldn't prepare statement: %w", err)
	}

	result, err := stmt.Query(user_id, user_id)
	if err == sql.ErrNoRows {
		return friends, nil
	} else if err != nil {
		return friends, fmt.Errorf("couldn't execute statement: %w", err)
	}

	for result.Next() {
		var (
			friend           models.Friend
			last_interaction models.Interaction

			friend_id         int
			pfp_path          sql.NullString
			friend_name       string
			relationship_tier sql.NullInt64
			birthday_month    sql.NullInt64
			birthday_day      sql.NullInt64
			friend_created_at time.Time
			interaction_date  sql.NullTime
			interaction_name  sql.NullString
			interaction_id    sql.NullInt64

			err error
		)

		err = result.Scan(
			&friend_id,
			&pfp_path,
			&friend_name,
			&relationship_tier,
			&birthday_month,
			&birthday_day,
			&friend_created_at,
			&interaction_date,
			&interaction_name,
			&interaction_id,
		)
		if err != nil {
			return friends, fmt.Errorf("couldn't scan column value to local variable: %w", err)
		}

		friend = models.Friend{
			ID:        uint(friend_id),
			Name:      friend_name,
			CreatedAt: friend_created_at,
		}
		if pfp_path.Valid {
			friend.ProfileImagePath = pfp_path.String
		}
		if relationship_tier.Valid {
			friend.RelationshipTier = uint(relationship_tier.Int64)
		}
		if birthday_month.Valid {
			friend.BirthdayMonth = int(birthday_month.Int64)
		}
		if birthday_day.Valid {
			friend.BirthdayDay = int(birthday_day.Int64)
		}

		if interaction_name.Valid {
			last_interaction.Name = interaction_name.String
		}
		if interaction_date.Valid {
			last_interaction.Date = interaction_date.Time
		}
		if interaction_id.Valid {
			last_interaction.ID = uint(interaction_id.Int64)
		}

		friend.LastInteraction = last_interaction

		friends = append(friends, friend)
	}

	// To sort friends by closest friends first
	if sortBy == "relationship_tier" {
		slices.Reverse(friends)
	}

	tx.Commit()
	return friends, err
}

func getFriends(user_id string) ([]models.Friend, error) {
	var friends []models.Friend

	tx, err := database.DB.Begin()
	if err != nil {
		return friends, fmt.Errorf("couldn't begin transaction: %w", err)
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
	WHERE r.user_id = ?
    `)
	if err != nil {
		return friends, fmt.Errorf("couldn't prepare statement: %w", err)
	}
	defer stmt.Close()

	rows, err := stmt.Query(user_id)
	if err != nil {
		return friends, fmt.Errorf("couldn't execute query: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var (
			friend_id        int
			name             string
			birthdayMonth    sql.NullInt64
			birthdayDay      sql.NullInt64
			profileImagePath sql.NullString
			relationshipTier sql.NullInt64
			lastInteraction  sql.NullTime
			lastMeetup       sql.NullTime
		)

		err = rows.Scan(
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
			return friends, fmt.Errorf("couldn't scan row: %w", err)
		}

		friend := models.Friend{
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

		friends = append(friends, friend)
	}

	if err = rows.Err(); err != nil {
		return friends, fmt.Errorf("rows error: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return friends, fmt.Errorf("couldn't commit transaction: %w", err)
	}

	return friends, nil
}

func getUrgentFriends(user_id string) ([]models.Friend, error) {
	var (
		friends []models.Friend

		urgentFriends []models.Friend
		err           error
	)

	friends, err = getFriends(user_id)
	if err == sql.ErrNoRows {
		return friends, nil
	}
	if err != nil {
		return friends, fmt.Errorf("couldn't find user's friends: %w", err)
	}

	urgentFriends, err = sortByRelationshipUrgency(friends)
	if err != nil {
		return urgentFriends, fmt.Errorf("couldn't sort relationships by urgency: %w", err)
	}

	return urgentFriends, err
}

func sortByRelationshipUrgency(friends []models.Friend) ([]models.Friend, error) {

	type kv struct {
		friend       models.Friend
		urgencyScore float64
	}

	var (
		// friendsTemplate            []models.Friend
		friendsWithUrgencies         []kv
		friendsSortedByUrgency       []models.Friend
		urgentFriendsSortedByUrgency []models.Friend
		err                          error
	)

	for _, friend := range friends {
		var (
			urgency_score float64
			err           error
		)

		urgency_score, err = GetUrgencyScore(friend)
		if err != nil {
			return friendsSortedByUrgency, fmt.Errorf("couldn't get %s's urgency score: %w", friend.Name, err)
		}

		pair := kv{
			friend:       friend,
			urgencyScore: urgency_score,
		}
		friendsWithUrgencies = append(friendsWithUrgencies, pair)
	}

	sort.Slice(friendsWithUrgencies, func(i int, j int) bool {
		return friendsWithUrgencies[i].urgencyScore > friendsWithUrgencies[j].urgencyScore
	})

	for i := 0; i < len(friendsWithUrgencies); i++ {
		if i >= maxNumberOfUrgentFriends {
			break
		}
		urgentFriendsSortedByUrgency = append(urgentFriendsSortedByUrgency, friendsWithUrgencies[i].friend)
	}

	return urgentFriendsSortedByUrgency, err
}

func GetUrgencyScore(friend models.Friend) (float64, error) {
	var (
		// daysForMaxUrgency int
		urgencyScore float64
		err          error
	)

	// switch friend.RelationshipTier {
	// case (1): // "inner clique"
	// 	daysForMaxUrgency = 8 // weekly
	// case (2): // "close friends"
	// 	daysForMaxUrgency = 32 // monthly
	// case (3): // "ordinary friends"
	// 	daysForMaxUrgency = 366 // 6-monthly-to-yearly
	// case (4): // "friends / acquaintances ('I know a guy' kinda friendships)"
	// 	daysForMaxUrgency = 731 // 2-yearly
	// default:
	// 	daysForMaxUrgency = 365 // yearly
	// }

	// today := time.Now()
	// lastInteractionDate := friend.LastInteractionDate

	// if lastInteractionDate.Truncate(24 * time.Hour).Equal(today.Truncate(24 * time.Hour)) {
	// 	// This is checking if the the last interaction data was today
	// 	// even if the times of day aren't exact
	// 	// Truncating the times just means rounding down to the nearest 24 hours
	// 	return 0, err
	// }

	// if lastInteractionDate.After(today) {
	// 	return urgencyScore, fmt.Errorf("last interaction/meetup date can't be in the future")
	// }

	// hoursSinceLastInteraction := today.Sub(friend.LastInteractionDate).Hours()
	// daysSincLastInteraction := hoursSinceLastInteraction / 24
	// urgencyScore = daysSincLastInteraction / float64(daysForMaxUrgency)
	// urgencyScore = math.Min(urgencyScore, 1) // caps at 100% pretty much

	return urgencyScore, err
}
