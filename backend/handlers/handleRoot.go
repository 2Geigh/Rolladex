package handlers

import (
	"fmt"
	"myfriends-backend/util"
	"net/http"
	"time"
)

var (
	dbFilePath = "../database/myFriends.db"
)

func Root(w http.ResponseWriter, req *http.Request) {

	util.LogHttpRequest(req)

	// isLoggedIn, err := IsLoggedIn(w, req, dbFilePath)
	// if err != nil {
	// 	util.ReportHttpError(err, w, "couldn't determine if user's logged in: %w", http.StatusInternalServerError)
	// }
	// if !isLoggedIn {
	// 	http.Redirect(w, req, "/login", http.StatusUnauthorized)
	// }

	if req.Method == http.MethodGet {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.WriteHeader(http.StatusSeeOther)
		// w.Write([]byte(`Welcome to the headless backend. If you'd like to use a GUI, check out the frontend at <a href="http://localhost:5173/">http://localhost:5173/</a>.`))
	} else {
		w.WriteHeader(http.StatusMethodNotAllowed)
	}

}

func Profile(w http.ResponseWriter, req *http.Request) {
	// Log request type
	fmt.Printf("\n%v: %v\n%v\n\n", time.Now(), req.Method, req.Body)
}
