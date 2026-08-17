package templating

import (
	"fmt"
	"html/template"
	"net/http"
)

var (
	unprotectedPageTemplates = []string{
		"web/template/layouts/base.html",
		"web/template/partials/head.html",
		"web/template/partials/Navbar/Navbar.html",
		"web/template/partials/Footer.html",
	}
	protectedPageTemplates = []string{
		"web/template/layouts/base_PROTECTED.html",
		"web/template/partials/head.html",
		"web/template/partials/Navbar/Navbar_PROTECTED.html",
		"web/template/partials/Footer.html",
	}
)

func RenderUnprotectedPage(w http.ResponseWriter, page_path string, data any) error {
	files := append(unprotectedPageTemplates, page_path)

	tmpl, err := template.ParseFiles(files...)
	if err != nil {
		return fmt.Errorf("parse template files failed: %w", err)
	}

	err = tmpl.ExecuteTemplate(w, "base", data)
	if err != nil {
		return fmt.Errorf("execute template failed: %w", err)
	}

	return nil
}

func RenderProtectedPage(w http.ResponseWriter, page_path string, data any) error {
	files := append(protectedPageTemplates, page_path)

	tmpl, err := template.ParseFiles(files...)
	if err != nil {
		return fmt.Errorf("parse template files failed: %w", err)
	}

	err = tmpl.ExecuteTemplate(w, "base", data)
	if err != nil {
		return fmt.Errorf("execute template failed: %w", err)
	}

	return nil
}
