package util

import (
	"fmt"
	"log"
	"net/http"
)

var (
	FrontendOrigin = "http://localhost:5173"
)

func ReportHttpError(err error, w http.ResponseWriter, errorMessage string, errorCode int) {
	http.Error(w, fmt.Sprintf(`%s: %v`, errorMessage, err), errorCode)
	log.Printf(`%s: %v`, errorMessage, err)
}

func LogHttpRequest(req *http.Request) {
	log.Printf("%v %v\n", req.Method, req.RequestURI)
}

func SetCrossOriginResourceSharing(w http.ResponseWriter, origin string) {
	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST, PUT, GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
