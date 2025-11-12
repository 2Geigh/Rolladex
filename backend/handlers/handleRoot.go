package handlers

import (
	"encoding/json"
	"fmt"
	"myfriends-backend/models"
	"net/http"
	"time"
)

func Root(w http.ResponseWriter, req *http.Request) {

	// Log request type
	fmt.Printf("\n%v: %v\n%v\n\n", time.Now(), req.Method, req.Body)

	if req.Method == http.MethodPost {

		var formData models.Friend
		err := json.NewDecoder(req.Body).Decode(&formData)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
		}

		// friend := models.Friend{
		// 	Name:                req.FormValue("name"),
		// 	LastInteractionDate: req.FormValue("last_interaction"),
		// 	LastMeetupDate:      req.FormValue("last_meetup"),
		// }

		// err := models.AddFriend(friend)
		// if err != nil {
		// 	log.Println(fmt.Errorf("Could not add friend to database: %v", err))
		// 	return
		// }
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Form submitted successfully."))
		return
	}

}

func Meetups(w http.ResponseWriter, req *http.Request) {
	// Log request type
	fmt.Printf("\n%v: %v\n%v\n\n", time.Now(), req.Method, req.Body)
}

func Profile(w http.ResponseWriter, req *http.Request) {
	// Log request type
	fmt.Printf("\n%v: %v\n%v\n\n", time.Now(), req.Method, req.Body)
}
