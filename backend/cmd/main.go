package main

import (
	"fmt"
	"log"
	"myfriends-backend/handlers"
	"net/http"
)

func main() {

	// Routes
	http.HandleFunc("/", handlers.Root)
	http.HandleFunc("/friends", handlers.Friends)
	http.HandleFunc("/meetups", handlers.Meetups)
	http.HandleFunc("/profile", handlers.Profile)

	// Start server
	port := 3001
	fmt.Printf("Listening on http://localhost:%d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))

}
