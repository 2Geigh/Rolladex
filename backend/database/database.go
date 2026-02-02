package database

import (
	"database/sql"
	"embed"
	"fmt"
	"log"
	"os"
	"rolladex-backend/util"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"github.com/pressly/goose/v3"
)

type SqlId interface {
	int | uint | string
}

var (
	DB *sql.DB = nil

	// DSN format for MariaDB/MySQL

	// Use go:embed to bundle migrations into the binary
	// This assumes your migrations are in a folder named 'migrations'
	//go:embed migrations/*.sql
	embedMigrations embed.FS
)

func InitializeDB() error {
	log.Println("Connecting to MariaDB...")

	err := godotenv.Load("../.env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	var (
		username string = os.Getenv("DB_USERNAME")
		password string = os.Getenv("DB_PASSWORD")
		dbHost   string = os.Getenv("DB_HOST")
		dbPort   string = os.Getenv("DB_PORT")
		dbName   string = os.Getenv("DB_NAME")

		dsn string = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", username, password, dbHost, dbPort, dbName)
	)

	// Open (or create) the SQLite database
	DB, err = sql.Open("mysql", dsn)
	if err != nil {
		return fmt.Errorf("failed to open database: %w", err)
	}

	// Check if the database is reachable
	if err = DB.Ping(); err != nil {
		return fmt.Errorf("failed to reach database: %w", err)
	}

	// Run Goose Migrations
	if err := runMigrations(); err != nil {
		return err
	}

	// Password update logic
	if err := updateSeedPasswords(); err != nil {
		log.Printf("Warning: Seed password update skipped or failed: %v", err)
	}

	log.Println("Database initialized and migrated.")
	return nil
}

func runMigrations() error {
	log.Println("Running migrations...")

	goose.SetBaseFS(embedMigrations)

	if err := goose.SetDialect("mysql"); err != nil {
		return err
	}

	// This runs all migrations in the 'migrations' directory
	if err := goose.Up(DB, "migrations"); err != nil {
		return fmt.Errorf("goose up failed: %w", err)
	}

	return nil
}

func updateSeedPasswords() error {
	var (
		users = []struct {
			username     string
			new_password string
		}{
			{"jesus_christ", "jesus"},
			{"party_pal_alice", "alice"},
			{"bob_minimal", "bob"},
			{"max_tester", "max"},
		}
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

		passwordHash, err := util.HashPassword(user.new_password + passwordSalt)
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

	return nil
}
