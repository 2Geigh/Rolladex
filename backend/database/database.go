package database

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"
	"time"
)

var (
	DB         *sql.DB = nil
	DbFilePath string  = "database/myFriends.db"

	// SQLite-optimized pool settings
	maxOppenDatabaseConnections int           = 1 // 1 writer only
	maxIdleDatabaseConnections  int           = 3 // Few idle readers
	maxConnectionLifetime       time.Duration = (5 * time.Minute)
)

func InitializeDB(dbFilePath string) error {
	var err error

	// Ensure the directory exists
	if err := os.MkdirAll(filepath.Dir(dbFilePath), os.ModePerm); err != nil {
		return fmt.Errorf("failed to create directory: %v", err)
	}

	// Open (or create) the SQLite database
	DB, err = sql.Open("sqlite", dbFilePath)
	if err != nil {
		return fmt.Errorf("failed to open database: %v\n", err)
	}

	// Check if the database is reachable
	err = DB.Ping()
	if err != nil {
		return fmt.Errorf("failed to reach database: %v\n", err)
	}

	// Set connection pool limits
	DB.SetMaxOpenConns(maxOppenDatabaseConnections)
	DB.SetMaxIdleConns(maxIdleDatabaseConnections)
	DB.SetConnMaxLifetime(maxConnectionLifetime)

	// Import database schema file
	databaseSchemaPath := filepath.Join("database", "sql", "init", "schema.sql")
	databaseSchema, err := os.ReadFile(databaseSchemaPath)
	if err != nil {
		return fmt.Errorf("couldn't read database schema file: %v\n", err)
	}

	// Execute schema migration
	_, err = DB.Exec(string(databaseSchema))
	if err != nil {
		return fmt.Errorf("couldn't execute database migration: %v\n", err)
	}

	return err
}

func CloseDB(DB *sql.DB) error {
	var err error

	err = DB.Close()

	return err
}
