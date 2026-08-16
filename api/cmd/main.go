package main

import (
	"fmt"
	"log"
	"net/http"
	"rolladex/internal/database"
	"rolladex/internal/handlers"
	"rolladex/internal/middleware"

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
	http.HandleFunc("/", middleware.Logging(handlers.Root))
	http.HandleFunc("/api_sanity_check", middleware.Logging(handlers.ApiSanityCheck))

	// Authentication
	http.HandleFunc("/login", middleware.Logging(handlers.Login))
	http.HandleFunc("/signup", middleware.Logging(handlers.Signup))
	http.HandleFunc("/logout", middleware.Logging(handlers.Logout))

	// Authorization
	http.HandleFunc("/session/valid", middleware.Logging(handlers.SessionValid))

	// Features
	http.HandleFunc("/home", middleware.Logging(handlers.Home))
	http.HandleFunc("/friends", middleware.Logging(handlers.Friends))
	http.HandleFunc("/friends/", middleware.Logging(handlers.FriendStandalonePage))
	http.HandleFunc("/friends/status", middleware.Logging(handlers.FriendsStatus))
	http.HandleFunc("/friends/interactions", middleware.Logging(handlers.FriendsInteractions))
	http.HandleFunc("/friends/notes", middleware.Logging(handlers.FriendsNotes))
	http.HandleFunc("/interactions/", middleware.Logging(handlers.InteractionStandalonePage))

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
