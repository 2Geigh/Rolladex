package util

import (
	"fmt"
	"log"
	"net/http"
	"time"
)

func ReportHttpError(err error, w http.ResponseWriter, errorMessage string, errorCode int) {
	http.Error(w, fmt.Sprintf(`%s: %v`, errorMessage, err), errorCode)
	log.Printf(`%s: %v`, errorMessage, err)
	// w.WriteHeader(errorCode)
}

func LogHttpRequest(req *http.Request) {
	fmt.Printf("%v: %v %v\n", time.Now().Format(time.DateTime), req.Method, req.RequestURI)
}

func SetCORS(w http.ResponseWriter) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
