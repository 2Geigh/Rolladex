package main

import (
	"fmt"
	"log"
	"net/http"
	"rolladex-backend/database"
	"rolladex-backend/handlers"

	"github.com/joho/godotenv"
)

var (
	port = 3001
)

func main() {
	godotenv.Load()

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
	http.HandleFunc("/friends/", handlers.FriendStandalonePage)
	http.HandleFunc("/friends/status", handlers.FriendsStatus)
	http.HandleFunc("/friends/interactions", handlers.FriendsInteractions)
	http.HandleFunc("/friends/notes", handlers.FriendsNotes)

	// Database
	err := database.InitializeDB()
	if err != nil {
		log.Fatal(fmt.Errorf("couldn't initialize database: %w", err))
	} // database auto-closes on ctrl+c, so no need to manually defer database closing for HTTP servers

	// Server
	log.Printf("Listening on http://0.0.0.0:%d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf("0.0.0.0:%d", port), nil))
}
