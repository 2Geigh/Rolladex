package middleware

import (
	"log"
	"net/http"
	"time"
)

func Logging(nextHandler http.HandlerFunc) http.HandlerFunc {

	return func(w http.ResponseWriter, req *http.Request) {

		start := time.Now()

		nextHandler.ServeHTTP(w, req)

		log.Println(req.RemoteAddr, req.Method, req.RequestURI, time.Since(start))

	}
}
