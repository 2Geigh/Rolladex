package handlers

import (
	"net/http"
	"rolladex/internal/controllers"
	"rolladex/internal/middleware"
	"rolladex/internal/models"
	"rolladex/internal/templating"
	"rolladex/internal/util"
)

func Home(w http.ResponseWriter, req *http.Request) {
	switch req.Method {

	case http.MethodGet:
		var (
			// threeMostRecentFriends []models.Friend
			err error
		)

		userContext, err := middleware.GetUserContext(req)
		if err != nil {
			util.ReportHttpError(err, w, "get user session context failed", http.StatusInternalServerError)
			return
		}

		urgentFriends, err := controllers.GetUrgentFriends(userContext.User_id)
		if err != nil {
			util.ReportHttpError(err, w, "get urgent friends failed", http.StatusInternalServerError)
			return
		}

		data := struct {
			Title           string
			Username        string
			UrgentFriends   []models.Friend
			TopThreeFriends []models.Friend
		}{Title: "Home | Rolladex", Username: userContext.Username, UrgentFriends: urgentFriends}

		err = templating.RenderProtectedPage(w, "web/template/pages/Home.html", data)
		if err != nil {
			util.ReportHttpError(err, w, "render page failed: %w", http.StatusInternalServerError)
			return
		}

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}
