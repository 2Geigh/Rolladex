package util

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
)

func ReportHttpError(err error, w http.ResponseWriter, errorMessage string, errorCode int) {
	http.Error(w, fmt.Sprintf(`%s: %v`, errorMessage, err), errorCode)
	log.Printf(`%s: %v`, errorMessage, err)
}

func LogHttpRequest(req *http.Request) {
	log.Printf("%s %v %v\n", req.RemoteAddr[0:strings.Index(req.RemoteAddr, ":")], req.Method, req.RequestURI)
}

func SetCrossOriginResourceSharing(w http.ResponseWriter, req *http.Request) {

	origin := os.Getenv("FRONTEND_ORIGIN")
	if origin == "" {
		origin = "http://localhost" // Fallback for local dev
	}

	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS, PUT")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	// Handle Preflight
	if req.Method == "OPTIONS" {
		w.WriteHeader(http.StatusNoContent)
		return
	}
}
