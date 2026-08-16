package main

import (
	"fmt"
	"log"
	"net/http"
	"rolladex/internal/database"
	"rolladex/internal/handlers"

	"github.com/joho/godotenv"
)

func main() {
	const (
		listening_port int = 3001
	)

	var (
		address string = fmt.Sprintf("0.0.0.0:%d", listening_port)
	)

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
	http.HandleFunc("/interactions/", handlers.InteractionStandalonePage)

	// Database
	err := database.InitializeDB()
	if err != nil {
		log.Fatalf("couldn't initialize database connection: %v", err)
	} // database auto-closes on ctrl+c, so no need to manually defer database closing for HTTP servers

	// Server
	log.Printf("Listening on %s (check the Docker Compose config what host machine port that maps to!)\n", address)
	err = http.ListenAndServe(address, nil)
	if err != nil {
		log.Fatalf("failed to start server on port %d", listening_port)
	}
}
