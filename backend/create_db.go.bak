package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	// Connect to 'postgres' database to create new db
	connStr := "postgres://postgres:YAKOZA@1234@127.0.0.1:1111/postgres?sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("Error connecting to the database: ", err)
	}
	defer db.Close()

	// Create the auth_app database
	_, err = db.Exec("CREATE DATABASE auth_app")
	if err != nil {
		// Database might already exist, check if that's the case
		var exists bool
		err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = 'auth_app')").Scan(&exists)
		if err != nil {
			log.Fatal("Error checking if database exists: ", err)
		}
		if exists {
			fmt.Println("Database 'auth_app' already exists")
		} else {
			log.Fatal("Error creating database: ", err)
		}
	} else {
		fmt.Println("Database 'auth_app' created successfully")
	}
}
