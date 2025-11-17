package util

import (
	"log"
	"net/http"
)

func ReportHttpError(err error, w http.ResponseWriter, errorMessage string, errorCode int) {
	http.Error(w, errorMessage, http.StatusInternalServerError)
	log.Println(errorMessage)
}
