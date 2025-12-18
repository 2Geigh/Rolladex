package main

import (
	"fmt"
	"log"
	"myfriends-backend/handlers"
	"net/http"
)

func main() {

	// Meta
	http.HandleFunc("/", handlers.Root)
	http.HandleFunc("/api_sanity_check", handlers.ApiSanityCheck)

	// Auth
	http.HandleFunc("/login", handlers.Login)
	http.HandleFunc("/signup", handlers.Signup)

	// Features
	http.HandleFunc("/home", handlers.Home)
	http.HandleFunc("/friends", handlers.Friends)
	http.HandleFunc("/friends/", handlers.FriendStandalonePage)
	http.HandleFunc("/meetups", handlers.Meetups)
	http.HandleFunc("/meetups/", handlers.MeetupStandalonePage)

	// UX
	http.HandleFunc("/profile", handlers.Profile)
	http.HandleFunc("/settings", handlers.Settings)

	// Misc.
	http.HandleFunc("/404", handlers.PageNotFound)

	// Server
	port := 3001
	fmt.Printf("Listening on http://localhost:%d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}
