package middleware

import (
	"log"
	"net/http"
	"sync"

	"golang.org/x/time/rate"
)

// A type to hold each client's rate limiter
type Client struct {
	limiter *rate.Limiter
}

var (
	clients = make(map[string]*Client)
	mu      sync.Mutex // Used as a locking mechanism to prevent race conditions
)

func clientLimiter(ip string) *rate.Limiter {
	var (
		requestsPerMinute rate.Limit = 5
		tokensPerBurst    int        = 1
	)

	mu.Lock()
	defer mu.Unlock()

	client, clientExists := clients[ip]
	if clientExists {
		return client.limiter
	}

	limiter := rate.NewLimiter(requestsPerMinute, tokensPerBurst)
	newClient := Client{limiter: limiter}
	clients[ip] = &newClient
	return limiter
}

func RateLimit(next http.Handler) http.Handler {
	handler := func(w http.ResponseWriter, req *http.Request) {
		ip := req.RemoteAddr
		limiter := clientLimiter(ip)

		isRequestAllowed := limiter.Allow()
		if !isRequestAllowed {
			http.Error(w, "Too many requests", http.StatusTooManyRequests)
			log.Printf("Suspected DOS from %s", ip)
			return
		}

		next.ServeHTTP(w, req)
	}

	return http.HandlerFunc(handler)
}
