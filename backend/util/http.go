package util

import (
	"fmt"
	"net/http"
	"time"
)

var (
	FrontendOrigin = "http://localhost:5173"
)

func ReportHttpError(err error, w http.ResponseWriter, errorMessage string, errorCode int) {
	http.Error(w, fmt.Sprintf(`%s: %v`, errorMessage, err), errorCode)
	LogWithTimestamp(fmt.Sprintf(`%s: %v`, errorMessage, err))
}

func LogHttpRequest(req *http.Request) {
	fmt.Printf("%v: %v %v\n", time.Now().Format(time.DateTime), req.Method, req.RequestURI)
}

func SetCrossOriginResourceSharing(w http.ResponseWriter, origin string) {
	w.Header().Add("Access-Control-Allow-Origin", origin)
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
}
