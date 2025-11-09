package main

import (
	"log"
	"myfriends-backend/handlers"
	"net/http"
)

func main() {

	// Routes
	http.HandleFunc("/", handlers.HandleRoot)

	// Start server
	log.Fatal(http.ListenAndServe(":3000", nil))

}
