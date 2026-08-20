package handlers

import (
	"net/http"
	"rolladex/internal/controllers"
	"rolladex/internal/templating"
	"rolladex/internal/util"
)

func Signup(w http.ResponseWriter, req *http.Request) {

	switch req.Method {

	case http.MethodGet:
		data := struct{ Title string }{Title: "Signup | Rolladex"}

		err := templating.RenderUnprotectedPage(w, "web/template/pages/Signup.html", data)
		if err != nil {
			util.ReportHttpError(err, w, "render page failed: %w", http.StatusInternalServerError)
			return
		}

	case http.MethodPost:
		statusCode, err := controllers.CreateUser(req)
		if err != nil {
			util.ReportHttpError(err, w, "create user failed: %w", statusCode)
			return
		}

		http.Redirect(w, req, "/login", http.StatusSeeOther)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}

}
