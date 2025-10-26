package main

import (
	"myfriends-backend/database"
)

func main() {
	database.InitDB()
	defer database.DB.Close()
}
