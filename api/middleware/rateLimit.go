package middleware

import (
	"log"
	"net"
	"net/http"
	"sync"
	"time"

	"golang.org/x/time/rate"
)

// A type to hold each client's rate limiter
type Client struct {
	limiter      *rate.Limiter
	blockedUntil time.Time
	lastSeen     time.Time
}

var (
	clients = make(map[string]*Client)
	mu      sync.Mutex // Used as a locking mechanism to prevent race conditions
)

func client(ip string) *Client {
	var (
		rateLimit  rate.Limit = 10
		burstLimit int        = 5
	)

	mu.Lock()
	defer mu.Unlock()

	client, clientExists := clients[ip]
	if clientExists {
		return client
	}

	limiter := rate.NewLimiter(rateLimit, burstLimit)
	newClient := Client{limiter: limiter}
	clients[ip] = &newClient
	return &newClient
}

func RateLimit(next http.Handler) http.Handler {
	handler := func(w http.ResponseWriter, req *http.Request) {
		var (
			penalty time.Duration = 2 * time.Minute
		)

		host, _, err := net.SplitHostPort(req.RemoteAddr)
		if err != nil {
			// Fallback if SplitHostPort fails (e.g., no port present)
			host = req.RemoteAddr
		}
		client := client(host)

		mu.Lock()
		if time.Now().Before(client.blockedUntil) {
			mu.Unlock()

			// Return without logging to suppress terminal noise
			w.WriteHeader(http.StatusForbidden)

			return
		}
		mu.Unlock()

		isRequestAllowed := client.limiter.Allow()
		if !isRequestAllowed {
			mu.Lock()
			client.blockedUntil = time.Now().Add(penalty)
			mu.Unlock()

			http.Error(w, "Too many requests", http.StatusTooManyRequests)
			log.Printf("Suspected DoS attack from %s", host)
			return
		}

		next.ServeHTTP(w, req)
	}

	return http.HandlerFunc(handler)
}

func CleanupClients() {
	for {
		time.Sleep(15 * time.Minute)

		mu.Lock()
		for ip, client := range clients {
			if time.Since(client.lastSeen) > 24*time.Hour {
				delete(clients, ip)
			}
		}
	}
}
