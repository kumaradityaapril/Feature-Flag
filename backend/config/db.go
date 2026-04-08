package config

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func ConnectDB() {

	databaseUrl := os.Getenv("DB_URL")

	pool, err := pgxpool.New(context.Background(), databaseUrl)

	if err != nil {
		log.Printf("Warning: Unable to connect to database: %v. Database-dependent features will fail.", err)
	} else {
		log.Println("Database connected successfully")
	}

	DB = pool
}
