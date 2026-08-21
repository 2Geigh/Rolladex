package middleware

import (
	"net/http"
)

func ProtectedRouteMiddleware(targetHandler http.HandlerFunc) http.HandlerFunc {
	return RateLimit(Logging(SessionValidation(targetHandler)))
}

func UnprotectedRouteMiddleware(targetHandler http.HandlerFunc) http.HandlerFunc {
	return RateLimit(Logging(targetHandler))
}
