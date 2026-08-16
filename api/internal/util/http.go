package util

import (
	"fmt"
	"log"
	"net/http"
)

func ReportHttpError(err error, w http.ResponseWriter, errorMessage string, errorCode int) {
	http.Error(w, fmt.Sprintf(`%s: %v`, errorMessage, err), errorCode)
	log.Printf(`%s: %v`, errorMessage, err)
}
