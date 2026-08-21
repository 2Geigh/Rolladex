package main

import (
	"fmt"
	"log"
	"net/http"
	"rolladex/internal/api"
	"rolladex/internal/database"
	"rolladex/internal/handlers"
	"rolladex/internal/middleware"
	"rolladex/internal/util"
	"time"

	"github.com/joho/godotenv"
)

var (
	ApiUptimeStart = time.Now()
)

func main() {
	util.ApiUptimeStart = time.Now()

	const (
		listening_port int = 3001
	)

	var (
		address string = fmt.Sprintf("0.0.0.0:%d", listening_port)
	)

	godotenv.Load()

	// Meta
	http.HandleFunc("/", middleware.UnprotectedRouteMiddleware(handlers.Root))
	http.HandleFunc("/*", middleware.UnprotectedRouteMiddleware(handlers.NotFound))
	http.HandleFunc("/api/health", middleware.UnprotectedRouteMiddleware(handlers.ApiHealth))

	// Authentication
	http.HandleFunc("/login", middleware.UnprotectedRouteMiddleware(handlers.Login))
	http.HandleFunc("/signup", middleware.UnprotectedRouteMiddleware(handlers.Signup))
	http.HandleFunc("/logout", middleware.UnprotectedRouteMiddleware(handlers.Logout))

	// Protected routes
	http.HandleFunc("/home", middleware.ProtectedRouteMiddleware(handlers.Home))

	// Database
	err := database.InitializeDB()
	if err != nil {
		log.Fatalf("couldn't initialize database connection: %v", err)
	} // database auto-closes on ctrl+c, so no need to manually defer database closing for HTTP servers

	// API maintenance
	go api.DeleteExpiredSessions()
	go api.RemoveStaleClients()

	// Server
	log.Printf("Listening on %s (check the Docker Compose config what host machine port that maps to!)\n", address)
	err = http.ListenAndServe(address, nil)
	if err != nil {
		log.Fatalf("failed to start server on port %d", listening_port)
	}
}
