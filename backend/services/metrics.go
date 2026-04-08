package services

import (
	"math/rand"
	"sync"
	"time"
)

var (
	trendsMu      sync.Mutex
	trendsData    [20]int
	lastSec       int64
)

func init() {
	lastSec = time.Now().Unix()
	rand.Seed(time.Now().UnixNano())
	
	// Pre-fill with some baseline ambient traffic (15-35)
	for i := 0; i < 20; i++ {
		trendsData[i] = rand.Intn(20) + 15
	}
}

func syncTime() {
	now := time.Now().Unix()
	if now > lastSec {
		shift := now - lastSec
		if shift >= 20 {
			for i := 0; i < 20; i++ {
				trendsData[i] = rand.Intn(20) + 15 // Ambient background heartbeat
			}
		} else {
			// Shift existing entries left
			for i := 0; i < 20-int(shift); i++ {
				trendsData[i] = trendsData[i+int(shift)]
			}
			// Fill the new buckets with ambient background heartbeat
			for i := 20 - int(shift); i < 20; i++ {
				trendsData[i] = rand.Intn(20) + 15
			}
		}
		lastSec = now
	}
}

// RecordEvaluation adds an explicit metric hit to the current second bucket.
func RecordEvaluation() {
	trendsMu.Lock()
	defer trendsMu.Unlock()
	syncTime()
	
	// Add a spike value since manual testing is usually 1 at a time, we make it visually visible
	trendsData[19] += rand.Intn(15) + 25
}

// GetTrends returns the current sliding window
func GetTrends() [20]int {
	trendsMu.Lock()
	defer trendsMu.Unlock()
	syncTime()
	return trendsData
}
