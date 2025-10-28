package main

import (
	"log"
	"myfriends-backend/database"
)

func main() {

	// Setup database opening and closure
	DB, err := database.InitDB()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer func() {
		if DB != nil {
			DB.Close()
		}
	}()

	// adam := models.User{
	// 	Username: "1",
	// 	Email:    "test@example.com",
	// 	Password: "password",
	// 	// Birthday:                 util.Date{Year: 2003, Month: 3, Day: 13},
	// 	// Time_without_interaction: time.Now(),
	// 	// Time_without_meetup:      time.Now(),
	// 	// Meetup_plans:             []models.Meetup{},
	// 	// RecievesNotifications:    map[string]bool{"email": false, "push_notification": true},
	// }
	// fmt.Println(adam)

}
