package handlers

import (
	"net/http"
	"rolladex/internal/controllers"
	"rolladex/internal/templating"
	"rolladex/internal/util"
)

func Login(w http.ResponseWriter, req *http.Request) {

	switch req.Method {

	case http.MethodGet:
		data := struct{ Title string }{Title: "Login | Rolladex"}

		err := templating.RenderUnprotectedPage(w, "web/template/pages/Login.html", data)
		if err != nil {
			util.ReportHttpError(err, w, "render page failed: %w", http.StatusInternalServerError)
			return
		}

	case http.MethodPost:
		statusCode, err := controllers.AttemptLogin(w, req)
		if err != nil {
			util.ReportHttpError(err, w, "login attempt failed", statusCode)
			return
		}

		http.Redirect(w, req, "/home", http.StatusSeeOther)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}

}
