package main

import (
	"log"
	"os"

	"feature-flag/config"
	"feature-flag/router"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found")
	}

	config.ConnectDB()
	config.InitRedis()

	r := router.SetupRouter()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8081"
	}

	log.Println("Server running on port", port)
	r.Run(":" + port)
}
