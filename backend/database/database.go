package database

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"myfriends-backend/util"
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
	log.Println("Initializing database...")
	var err error

	// Ensure the directory exists
	if err := os.MkdirAll(filepath.Dir(dbFilePath), os.ModePerm); err != nil {
		return fmt.Errorf("failed to create directory: %v", err)
	}

	// Check if SQLite database file exists
	var databaseExists bool
	_, err = os.Stat(dbFilePath)
	if err == nil {
		databaseExists = true
	} else if errors.Is(err, os.ErrNotExist) {
		databaseExists = false
	} else {
		return fmt.Errorf("couldn't determine if database file exists: %w", err)
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

	err = migrate()
	if err != nil {
		return fmt.Errorf("couldn't migrate database schema: %w", err)
	}

	if !databaseExists {
		err = seed()
		if err != nil {
			os.Remove(dbFilePath)
			return fmt.Errorf("couldn't seed database: %w", err)
		}
	}

	log.Println("Initialized database.")
	return err
}

func migrate() error {
	log.Println("Migrating database schema...")
	var (
		databaseSchemaPath string = filepath.Join("database", "schema", "schema.sql")
		err                error
	)

	databaseSchema, err := os.ReadFile(databaseSchemaPath)
	if err != nil {
		return fmt.Errorf("couldn't read database schema file: %v\n", err)
	}

	_, err = DB.Exec(string(databaseSchema))
	if err != nil {
		return fmt.Errorf("couldn't execute database migration: %v\n", err)
	}

	log.Println("Migrated database schema.")
	return err
}

func seed() error {
	log.Println("Seeding database...")
	var (
		seedFilePath = filepath.Join("database", "seed", "seed.sql")
		err          error
	)

	seedScript, err := os.ReadFile(seedFilePath)
	if err != nil {
		return fmt.Errorf("couldn't read database seed file: %w", err)
	}

	_, err = DB.Exec(string(seedScript))
	if err != nil {
		return fmt.Errorf("couldn't execute database migration: %w", err)
	}

	err = updateSeedPasswords()
	if err != nil {
		return fmt.Errorf("couldn't update passwords in seed data: %w", err)
	}

	log.Println("Database seeded.")
	return err
}

func updateSeedPasswords() error {
	var (
		users = []struct {
			username string
			password string
		}{
			{"jesus_christ", "jesus"},
			{"party_pal_alice", "alice"},
			{"bob_minimal", "bob"},
		}

		err error
	)

	tx, err := DB.Begin()
	if err != nil {
		return fmt.Errorf("couldn't create transaction: %w", err)
	}
	defer tx.Rollback()

	totalRowsAffected := 0

	for _, user := range users {
		passwordSalt, err := util.GenerateSalt(util.SaltLength)
		if err != nil {
			return fmt.Errorf("couldn't generate salt for user %s: %w", user.username, err)
		}

		passwordHash, err := util.HashPassword(user.password + passwordSalt)
		if err != nil {
			return fmt.Errorf("couldn't hash salted password for user %s: %w", user.username, err)
		}

		result, err := tx.Exec(`
			UPDATE Users
			SET passwordHash = ?, passwordSalt = ?
			WHERE username = ?`, passwordHash, passwordSalt, user.username)
		if err != nil {
			return err
		}

		rowsaffected, err := result.RowsAffected()
		if err != nil {
			return fmt.Errorf("couldn't count rows affected for user %s: %w", user.username, err)
		}
		totalRowsAffected += int(rowsaffected)
	}

	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("couldn't commit transaction: %w", err)
	}

	if totalRowsAffected == 0 {
		return fmt.Errorf("no rows affected, no updates made")
	}

	return err
}
