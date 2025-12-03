package main

import (
	"fmt"
	"log"
	"myfriends-backend/handlers"
	"net/http"
)

func main() {
	http.HandleFunc("/", handlers.Root)
	http.HandleFunc("/login", handlers.Login)
	http.HandleFunc("/signup", handlers.Signup)
	http.HandleFunc("/home", handlers.Home)
	http.HandleFunc("/friends", handlers.Friends)
	http.HandleFunc("/friends/", handlers.FriendStandalonePage)
	http.HandleFunc("/meetups", handlers.Meetups)
	http.HandleFunc("/meetups/", handlers.MeetupStandalonePage)
	http.HandleFunc("/profile", handlers.Profile)
	http.HandleFunc("/settings", handlers.Settings)
	http.HandleFunc("/404", handlers.PageNotFound)

	port := 3001
	fmt.Printf("Listening on http://localhost:%d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}
