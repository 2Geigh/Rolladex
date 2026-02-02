package util

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func ReportHttpError(err error, w http.ResponseWriter, errorMessage string, errorCode int) {
	http.Error(w, fmt.Sprintf(`%s: %v`, errorMessage, err), errorCode)
	log.Printf(`%s: %v`, errorMessage, err)
}

func LogHttpRequest(req *http.Request) {
	log.Printf("%v %v\n", req.Method, req.RequestURI)
}

func SetCrossOriginResourceSharing(w http.ResponseWriter) {

	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	origin := os.Getenv("FRONTEND_ORIGIN")

	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Credentials", "true")

	w.Header().Set("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

}
