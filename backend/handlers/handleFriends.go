package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"myfriends-backend/models"
	"myfriends-backend/util"
	"net/http"
	"time"
)

func Friends(w http.ResponseWriter, req *http.Request) {

	// ALLOW CORS
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")

	// Log request type
	fmt.Printf("%v: %v %v\n", time.Now().Format(time.DateTime), req.Method, req.RequestURI)

	if req.Method == http.MethodPost {

		// Grab data
		var friend models.Friend
		decoder := json.NewDecoder(req.Body)
		err := decoder.Decode(&friend)
		if err != nil {
			http.Error(w, "Could not decode JSON request", http.StatusBadRequest)
			log.Println(err)
		}

		// Validate data first
		_, err = util.IsValidDate(friend.LastInteractionDate)
		if err != nil {
			friend.LastInteractionDate = ""
			util.ReportHttpError(err, w, "invalid last_interaction date formatting", http.StatusBadRequest)
		}
		_, err = util.IsValidDate(friend.LastMeetupDate)
		if err != nil {
			friend.LastMeetupDate = ""
			util.ReportHttpError(err, w, "invalid last_meetup date formatting", http.StatusBadRequest)
		}

		// Add friend to database
		fmt.Println("Adding new friend:")
		fmt.Printf("Name: %s\n", friend.Name)
		fmt.Printf("Last interaction: %s\n", friend.LastInteractionDate)
		fmt.Printf("Last meetup: %s\n", friend.LastMeetupDate)
		err = models.AddFriend(friend)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't add friend to database", http.StatusInternalServerError)
		}

	}

	if req.Method == http.MethodGet {

		// DON'T TRY TO PARSE THE REQUEST
		// JUST GET THE DATA FROM THE DATABASE AND THEN SEND IT AS A JSON RESPONSE

		// Fetch friends from database
		friends, err := models.GetFriends()
		if err != nil {
			util.ReportHttpError(err, w, "couldn't fetch friends from database", http.StatusInternalServerError)
		}

		// Marshall friends splice to JSON
		friendsJSON, err := json.Marshal(friends)
		log.Printf("friendsJSON:\n%v", string(friendsJSON))
		if err != nil {
			util.ReportHttpError(err, w, "couldn't marshall friends data to JSON", http.StatusInternalServerError)
		}

		// Write response
		w.Header().Set("Content-Type", "application/json")
		_, err = w.Write(friendsJSON)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't write response", http.StatusInternalServerError)
		}

		// Log output
		log.Println("Found the following friends:")
		for _, friend := range friends {
			log.Printf("ID-%d: %s", friend.ID, friend.Name)
		}

	}

	if req.Method == http.MethodDelete {

	}

}
