package api

import (
	"sync"
	"time"

	"golang.org/x/time/rate"
)

// A type to hold each client's rate limiter
type Client struct {
	Limiter      *rate.Limiter
	BlockedUntil time.Time
	LastSeen     time.Time
}

var (
	Clients               = make(map[string]*Client)
	ClientManagementMutex sync.Mutex // Used as a locking mechanism to prevent race conditions
)

func RemoveStaleClients() {
	for {
		ClientManagementMutex.Lock()
		for ip, client := range Clients {
			if time.Since(client.LastSeen) > 24*time.Hour {
				delete(Clients, ip)
			}
		}
		ClientManagementMutex.Unlock()

		time.Sleep(15 * time.Minute)
	}
}

func SaveClient(ip string) *Client {
	var (
		rateLimit  rate.Limit = 10
		burstLimit int        = 10
	)

	ClientManagementMutex.Lock()
	defer ClientManagementMutex.Unlock()

	client, clientExists := Clients[ip]
	if clientExists {
		client.LastSeen = time.Now()
		return client
	}

	limiter := rate.NewLimiter(rateLimit, burstLimit)
	newClient := Client{Limiter: limiter}
	Clients[ip] = &newClient
	return &newClient
}
