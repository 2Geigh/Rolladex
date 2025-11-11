package main

import (
	"fmt"
	"log"
	"myfriends-backend/handlers"
	"net/http"
)

func main() {

	// Routes
	http.HandleFunc("/", handlers.HandleRoot)

	// Start server
	port := 3000
	fmt.Printf("Listening on http://localhost:%d\n", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))

}
