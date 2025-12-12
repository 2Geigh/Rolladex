package database

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"
)

func InitializeDB(dbFilePath string) (*sql.DB, error) {
	var (
		err error
		DB  *sql.DB = nil
	)

	// Ensure the directory exists
	if err := os.MkdirAll(filepath.Dir(dbFilePath), os.ModePerm); err != nil {
		return nil, fmt.Errorf("failed to create directory: %v", err)
	}

	// Open (or create) the SQLite database
	DB, err = sql.Open("sqlite", dbFilePath)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %v\n", err)
	}

	// Check if the database is reachable
	err = DB.Ping()
	if err != nil {
		return nil, fmt.Errorf("failed to reach database: %v\n", err)
	}

	// Import database schema file
	databaseSchemaPath := filepath.Join("database", "sql", "init", "schema.sql")
	databaseSchema, err := os.ReadFile(databaseSchemaPath)
	if err != nil {
		return DB, fmt.Errorf("couldn't read database schema file: %v\n", err)
	}

	// Execute schema migration
	_, err = DB.Exec(string(databaseSchema))
	if err != nil {
		return DB, fmt.Errorf("couldn't execute database migration: %v\n", err)
	}

	return DB, err
}

func CloseDB(DB *sql.DB) error {
	var err error

	err = DB.Close()

	return err
}
