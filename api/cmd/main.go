package main

import (
	"fmt"
	"log"
	"net/http"
	"rolladex-backend/database"
	"rolladex-backend/handlers"
	"rolladex-backend/middleware"

	"github.com/joho/godotenv"
)

var (
	port = 3001
)

func main() {
	godotenv.Load()

	// Meta
	registerRoute("/api_sanity_check", handlers.ApiSanityCheck)

	// Root
	registerRoute("/", handlers.Root)

	// Authentication
	registerRoute("/login", handlers.Login)
	registerRoute("/signup", handlers.Signup)
	registerRoute("/logout", handlers.Logout)

	// Authorization
	registerRoute("/session/valid", handlers.SessionValid)

	// Features
	registerRoute("/home", handlers.Home)
	registerRoute("/friends", handlers.Friends)
	registerRoute("/friends/", handlers.FriendStandalonePage)
	registerRoute("/friends/status", handlers.FriendsStatus)
	registerRoute("/friends/interactions", handlers.FriendsInteractions)
	registerRoute("/friends/notes", handlers.FriendsNotes)
	registerRoute("/interactions/", handlers.InteractionStandalonePage)

	// Database
	err := database.InitializeDB()
	if err != nil {
		log.Fatal(fmt.Errorf("couldn't initialize database: %w", err))
	} // database auto-closes on ctrl+c, so no need to manually defer database closing for HTTP servers

	go middleware.CleanupClients()

	// Server
	log.Printf("Listening on http://0.0.0.0:%d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf("0.0.0.0:%d", port), nil))
}

func registerRoute(path string, handler http.HandlerFunc) {
	http.Handle(path,
		middleware.RateLimit(
			http.HandlerFunc(handler),
		),
	)
}
