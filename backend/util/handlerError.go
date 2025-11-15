package util

import (
	"fmt"
	"log"
	"net/http"
)

func ReportHttpError(err error, w http.ResponseWriter) {
	errorMessage := fmt.Sprintf("Could not decode POST request JSON: %v", err)
	http.Error(w, errorMessage, http.StatusInternalServerError)
	log.Println(errorMessage)
}
