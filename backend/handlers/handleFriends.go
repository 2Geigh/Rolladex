package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"myfriends-backend/models"
	"net/http"
	"time"
)

func Friends(w http.ResponseWriter, req *http.Request) {
	// ALLOW CORS
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	// w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Log request type
	fmt.Printf("\n%v: %v\n%v\n\n", time.Now(), req.Method, req.URL)

	// Grab data
	var friend models.Friend
	decoder := json.NewDecoder(req.Body)
	err := decoder.Decode(&friend)
	if err != nil {
		http.Error(w, "Could not decode JSON request", http.StatusBadRequest)
		log.Println(err)
	}

	// Add friend to database
	fmt.Println("Adding new friend:")
	fmt.Printf("Name: %s\n", friend.Name)
	fmt.Printf("Last interaction: %s\n", friend.LastInteractionDate)
	fmt.Printf("Last meetup: %s\n", friend.LastMeetupDate)
	err = models.AddFriend(friend)
	if err != nil {
		http.Error(w, "Failed to add friend to database", http.StatusInternalServerError)
		log.Println(err)
	}
}
