package templating

import (
	"fmt"
	"html/template"
	"net/http"
)

var (
	unprotectedTemplates = []string{
		"web/template/partials/head.html",
		"web/template/layouts/base.html",
		"web/template/partials/Footer.html",
		"web/template/partials/Navbar/Navbar.html",
	}
	protectedTemplates = []string{
		"web/template/partials/head.html",
		"web/template/layouts/base_PROTECTED.html",
		"web/template/partials/Footer.html",
		"web/template/partials/Navbar/Navbar_PROTECTED.html",
	}
)

func RenderUnprotectedPage(w http.ResponseWriter, page_path string, data any) error {
	files := append(unprotectedTemplates, page_path)

	tmpl, err := template.ParseFiles(files...)
	if err != nil {

	}

	err = tmpl.ExecuteTemplate(w, "base", data)
	if err != nil {
		return fmt.Errorf("execute template failed: %w", err)
	}

	return nil
}

func RenderProtectedPage(w http.ResponseWriter, page_path string, data any) error {
	files := append(protectedTemplates, page_path)

	tmpl, err := template.ParseFiles(files...)
	if err != nil {

	}

	err = tmpl.ExecuteTemplate(w, "base", data)
	if err != nil {
		return fmt.Errorf("execute template failed: %w", err)
	}

	return nil
}
