package config

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/redis/go-redis/v9"
)

var (
	RedisClient *redis.Client
	Ctx         = context.Background()
)

func InitRedis() {
	redisURL := os.Getenv("REDIS_URL")
	
	if redisURL != "" {
		opts, err := redis.ParseURL(redisURL)
		if err != nil {
			log.Printf("Warning: Failed to parse REDIS_URL: %v", err)
			return
		}
		RedisClient = redis.NewClient(opts)
		addr := opts.Addr
		pong, err := RedisClient.Ping(Ctx).Result()
		if err != nil {
			log.Printf("Warning: Failed to connect to Redis at %s: %v. Caching will be disabled.", addr, err)
			RedisClient = nil
		} else {
			log.Printf("Successfully connected to Redis at %s (response: %s)", addr, pong)
		}
		return
	}

	redisHost := os.Getenv("REDIS_HOST")
	if redisHost == "" {
		redisHost = "localhost" 
	}

	redisPort := os.Getenv("REDIS_PORT")
	if redisPort == "" {
		redisPort = "6379"
	}

	addr := fmt.Sprintf("%s:%s", redisHost, redisPort)

	RedisClient = redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: "", 
		DB:       0,  
	})

	pong, err := RedisClient.Ping(Ctx).Result()
	if err != nil {
		log.Printf("Warning: Failed to connect to Redis at %s: %v. Caching will be disabled.", addr, err)
		RedisClient = nil
	} else {
		log.Printf("Successfully connected to Redis at %s (response: %s)", addr, pong)
	}
}
