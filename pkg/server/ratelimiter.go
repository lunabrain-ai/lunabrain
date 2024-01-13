package server

import (
	"sync"
	"time"
)

// Define a struct for the rate limiter
type RateLimiter struct {
	visitors map[string]*Visitor
	mu       sync.Mutex
}

// Visitor keeps track of the number of requests and the last time of access
type Visitor struct {
	lastSeen time.Time
	count    int
}

// NewRateLimiter initializes a new RateLimiter
func NewRateLimiter() *RateLimiter {
	return &RateLimiter{
		visitors: make(map[string]*Visitor),
	}
}

// Visit updates the rate limiter for a given IP
func (rl *RateLimiter) Visit(ip string) bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	v, exists := rl.visitors[ip]
	if !exists {
		rl.visitors[ip] = &Visitor{lastSeen: time.Now(), count: 1}
		return true
	}

	// Reset count if it's a new day
	if time.Now().Sub(v.lastSeen) > time.Minute {
		v.count = 0
	}

	v.lastSeen = time.Now()
	v.count++

	// Block the request if the count exceeds a threshold, e.g., 100 requests per day
	if v.count > 100 {
		return false
	}

	return true
}
