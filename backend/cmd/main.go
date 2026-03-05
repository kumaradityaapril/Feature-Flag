package main

import (
	"log"

	"feature-flag/config"
	"feature-flag/router"
)

func main() {
	config.ConnectDB()

	r := router.SetupRouter()

	log.Println("Server running on port 8081")
	r.Run(":8081")
}
