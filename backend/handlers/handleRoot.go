package handlers

import (
	"fmt"
	"myfriends-backend/models"
	"net/http"
	"time"
)

func HandleRoot(w http.ResponseWriter, req *http.Request) {

	// Log request type
	fmt.Printf("%v: %v\n", time.Now(), req.Method)

	if req.Method == http.MethodPost {
		friend := models.Friend{
			Name: req.FormValue("name"),
		}

		models.AddFriend(friend)

	} else {
		http.ServeFile(w, req, "./views/index.html")
	}

}
