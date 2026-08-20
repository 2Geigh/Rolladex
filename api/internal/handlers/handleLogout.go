package handlers

import (
	"net/http"
	"rolladex/internal/controllers"
	"rolladex/internal/util"
)

func Logout(w http.ResponseWriter, req *http.Request) {

	switch req.Method {

	case http.MethodGet:
		statusCode, err := controllers.LogoutUser(w, req)
		if err != nil {
			util.ReportHttpError(err, w, "logout failed", statusCode)
		}

		http.Redirect(w, req, "/login", http.StatusSeeOther)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}

}
