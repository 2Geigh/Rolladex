package util

import "text/template"

var (
	Templates *template.Template = template.Must(template.ParseGlob("web/template/**/*.html"))
)
