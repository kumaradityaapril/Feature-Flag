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
		log.Fatal("Unable to connect to database:", err)
	}

	DB = pool

	log.Println("Database connected successfully")
}
