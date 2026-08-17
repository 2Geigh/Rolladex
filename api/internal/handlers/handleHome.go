package handlers

import (
	"net/http"
	"rolladex/internal/templating"
	"rolladex/internal/util"
)

func Home(w http.ResponseWriter, req *http.Request) {

	switch req.Method {

	case http.MethodGet:
		data := struct {
			Title    string
			Username string
		}{Title: "Home | Rolladex", Username: "undefined user"}

		err := templating.RenderProtectedPage(w, "web/template/pages/Home.html", data)
		if err != nil {
			util.ReportHttpError(err, w, "render page failed: %w", http.StatusInternalServerError)
			return
		}

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}
