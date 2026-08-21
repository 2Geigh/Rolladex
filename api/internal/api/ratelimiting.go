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

func CleanupClients() {
	for {
		time.Sleep(15 * time.Minute)

		ClientManagementMutex.Lock()
		for ip, client := range Clients {
			if time.Since(client.LastSeen) > 24*time.Hour {
				delete(Clients, ip)
			}
		}
		ClientManagementMutex.Unlock()
	}
}
