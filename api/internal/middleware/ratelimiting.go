package middleware

import (
	"log"
	"net"
	"net/http"
	"rolladex/internal/api"
	"time"

	"golang.org/x/time/rate"
)

func RateLimit(nextHandler http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		var (
			penalty time.Duration = 2 * time.Minute
		)

		host, _, err := net.SplitHostPort(req.RemoteAddr)
		if err != nil {
			// Fallback if SplitHostPort fails (e.g., no port present)
			host = req.RemoteAddr
		}
		client := saveClient(host)

		api.ClientManagementMutex.Lock()
		blocked := time.Now().Before(client.BlockedUntil)
		api.ClientManagementMutex.Unlock()
		if blocked {
			// Return without logging to suppress terminal noise
			w.WriteHeader(http.StatusTooManyRequests)
			return
		}

		isRequestAllowed := client.Limiter.Allow()
		if !isRequestAllowed {
			api.ClientManagementMutex.Lock()
			client.BlockedUntil = time.Now().Add(penalty)
			api.ClientManagementMutex.Unlock()

			w.WriteHeader(http.StatusTooManyRequests)
			http.Error(w, "Too many requests", http.StatusTooManyRequests)
			log.Printf("Suspected DoS attack from %s", host)
			return
		}

		nextHandler.ServeHTTP(w, req)
	}

}

func saveClient(ip string) *api.Client {
	var (
		rateLimit  rate.Limit = 10
		burstLimit int        = 10
	)

	api.ClientManagementMutex.Lock()
	defer api.ClientManagementMutex.Unlock()

	client, clientExists := api.Clients[ip]
	if clientExists {
		client.LastSeen = time.Now()
		return client
	}

	limiter := rate.NewLimiter(rateLimit, burstLimit)
	newClient := api.Client{Limiter: limiter}
	api.Clients[ip] = &newClient
	return &newClient
}

func removeStaleClients() {
	for {
		api.ClientManagementMutex.Lock()
		for ip, client := range api.Clients {
			if time.Since(client.LastSeen) > 24*time.Hour {
				delete(api.Clients, ip)
			}
		}
		api.ClientManagementMutex.Unlock()

		time.Sleep(15 * time.Minute)
	}
}
