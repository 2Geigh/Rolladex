package templating

import (
	"fmt"
	"html/template"
	"net/http"
)

var commonTemplates = []string{
	"web/template/layouts/base.html",
	"web/template/partials/Footer.html",
	"web/template/partials/Navbar.html",
}

func RenderAppPage(w http.ResponseWriter, page_path string, data any) error {
	files := append(commonTemplates, page_path)

	tmpl, err := template.ParseFiles(files...)
	if err != nil {

	}

	err = tmpl.ExecuteTemplate(w, "base", data)
	if err != nil {
		return fmt.Errorf("execute template failed: %w", err)
	}

	return nil
}
