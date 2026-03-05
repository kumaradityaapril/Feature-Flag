package config

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func ConnectDB() {

	databaseUrl := "postgres://postgres:postgres123@localhost:5432/feature_flags"

	pool, err := pgxpool.New(context.Background(), databaseUrl)

	if err != nil {
		log.Fatal("Unable to connect to database:", err)
	}

	DB = pool

	log.Println("Database connected successfully")
}