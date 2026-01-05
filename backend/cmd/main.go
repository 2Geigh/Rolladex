package main

import (
	"fmt"
	"log"
	"myfriends-backend/database"
	"myfriends-backend/handlers"
	"net/http"

	"github.com/inancgumus/screen"
)

var (
	port = 3001
)

func main() {
	screen.Clear()

	// Meta
	http.HandleFunc("/", handlers.Root)
	http.HandleFunc("/api_sanity_check", handlers.ApiSanityCheck)

	// Authentication
	http.HandleFunc("/login", handlers.Login)
	http.HandleFunc("/signup", handlers.Signup)
	http.HandleFunc("/logout", handlers.Logout)

	// Authorization
	http.HandleFunc("/session/valid", handlers.SessionValid)

	// Features
	http.HandleFunc("/home", handlers.Home)
	http.HandleFunc("/friends", handlers.Friends)
	http.HandleFunc("/friends/urgent", handlers.FriendsUrgent)
	// http.HandleFunc("/interactions/pastmonth", handlers.InteractionsPastMonth)
	// http.HandleFunc("/friends/", handlers.FriendStandalonePage)

	// UX
	http.HandleFunc("/profile", handlers.Profile)
	http.HandleFunc("/settings", handlers.Settings)

	// Misc.
	http.HandleFunc("/404", handlers.PageNotFound)

	// Database
	err := database.InitializeDB(database.DbFilePath)
	if err != nil {
		log.Fatal(fmt.Errorf("couldn't initialize database: %w", err))
	} // database auto-closes on ctrl+c, so no need to manually defer database closing for HTTP servers

	// Server
	log.Printf("Listening on http://localhost:%d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}
