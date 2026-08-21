package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"rolladex/internal/database"
	"rolladex/internal/util"
	"runtime"
	"sync"
	"time"
)

type serviceHealthCheck struct {
	Name      string        `json:"Name"`
	IsHealthy bool          `json:"IsHealthy"`
	Latency   time.Duration `json:"Latency"`
	Message   *string       `json:"Message"`
}

type apiHealthCheck struct {
	IsHealthy    bool                          `json:"IsHealthy"`
	Timestamp    time.Time                     `json:"Timestamp"`
	TotalLatency time.Duration                 `json:"TotalLatencyNanoseconds"`
	Uptime       time.Duration                 `json:"UptimeNanoseconds"`
	Checks       map[string]serviceHealthCheck `json:"Checks"`
}

func ApiHealth(w http.ResponseWriter, req *http.Request) {
	switch req.Method {

	case http.MethodGet:
		w.Header().Add("Cache-Control", "no-cache")

		var (
			wg        sync.WaitGroup
			apiHealth apiHealthCheck = apiHealthCheck{
				IsHealthy:    true,
				Checks:       make(map[string]serviceHealthCheck),
				Timestamp:    time.Now(),
				TotalLatency: time.Since(time.Now()),
				Uptime:       time.Since(util.ApiUptimeStart)}
		)

		wg.Go(apiHealth.checkDatabaseHealth)
		wg.Go(apiHealth.checkMemoryHealth)
		wg.Wait()

		if !apiHealth.IsHealthy {
			w.WriteHeader(http.StatusInternalServerError)
		}

		for _, check := range apiHealth.Checks {
			apiHealth.TotalLatency += check.Latency

			if !check.IsHealthy {
				apiHealth.IsHealthy = false
				responseBody, err := json.Marshal(apiHealth)
				if err != nil {
					util.ReportHttpError(err, w, "marshal healthcheck to JSON failed", http.StatusInternalServerError)
					return
				}

				w.Write([]byte(responseBody))
				return
			}
		}

		responseBody, err := json.Marshal(apiHealth)
		if err != nil {
			util.ReportHttpError(err, w, "marshal healthcheck to JSON failed", http.StatusInternalServerError)
			return
		}

		w.Write(responseBody)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}
}

func (apiHealthCheck *apiHealthCheck) checkDatabaseHealth() {
	var (
		start = time.Now()
		check = serviceHealthCheck{
			Name:      fmt.Sprintf("Database @ %s", start),
			IsHealthy: true,
		}
		timeoutThreshold = 3 * time.Second
	)

	errCh := make(chan error, 1)

	go func() {
		rows, err := database.DB.Query(`SELECT 1;`)
		if err != nil {
			errCh <- err
		}
		defer rows.Close()

		errCh <- nil
	}()

	select {
	case err := <-errCh:
		if err != nil {
			message := err.Error()
			check.IsHealthy = false
			check.Message = &message
		}

	case <-time.After(timeoutThreshold):
		message := "database health check timed out"
		check.IsHealthy = false
		check.Message = &message
	}

	check.Latency = time.Since(start)
	apiHealthCheck.Checks["db"] = check
}

func (apiHealthCheck *apiHealthCheck) checkMemoryHealth() {

	var (
		start = time.Now()
		check = serviceHealthCheck{
			Name:      fmt.Sprintf("Memory @ %s", start),
			IsHealthy: true}
		stats runtime.MemStats
	)

	const (
		memoryThreshold uint = 2000000000 // 2 Gb
	)

	runtime.ReadMemStats(&stats)
	if stats.HeapAlloc > uint64(memoryThreshold) {
		message := fmt.Sprintf("memory usage of %d recorded, exceeding predifined %d threshold", stats.HeapAlloc, memoryThreshold)

		check.Message = &message
		check.IsHealthy = false
	}

	check.Latency = time.Since(start)
	apiHealthCheck.Checks["ram"] = check
}
