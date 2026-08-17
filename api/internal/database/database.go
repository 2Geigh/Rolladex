package database

import (
	"database/sql"
	"embed"
	"fmt"
	"log"
	"os"
	"rolladex/internal/util"

	_ "github.com/lib/pq"
)

type SqlId interface {
	int | uint | string
}

var (
	DB *sql.DB = nil

	// Use go:embed to bundle migrations into the binary
	// This assumes your migrations are in a folder named 'migrations'
	//go:embed migrations/*.sql
	embedMigrations embed.FS
)

func InitializeDB() error {
	log.Println("Connecting to Postgresql...")

	var (
		username string = os.Getenv("DB_USERNAME")
		password string = os.Getenv("DB_PASSWORD")
		dbHost   string = os.Getenv("DB_HOST")
		dbPort   string = os.Getenv("DB_PORT")
		dbName   string = os.Getenv("DB_NAME")

		dsn string = fmt.Sprintf("postgresql://%s:%s@%s:%s/%s?sslmode=disable", username, password, dbHost, dbPort, dbName)

		err error
	)

	if username == "" {
		log.Println("Warning: DB_USERNAME is empty. Connection might fail.")
	}

	DB, err = sql.Open("postgres", dsn)
	if err != nil {
		return fmt.Errorf("open database connection failed: %w", err)
	}

	// Verify database connection
	err = DB.Ping()
	if err != nil {
		return fmt.Errorf("verify database connection failed: %w", err)
	}
	log.Println("Database connection successful.")

	// // Run Goose Migrations
	// if err := runMigrations(); err != nil {
	// 	return fmt.Errorf("run migrations failed: %w", err)
	// }
	// log.Println("Database migration successful.")

	// // Password update logic for the seed template/testing users
	// if err := updateSeedPasswords(); err != nil {
	// 	log.Printf("Warning: Seed password update skipped or failed: %v", err)
	// }

	return nil
}

// func runMigrations() error {
// 	log.Println("Running migrations...")

// 	goose.SetBaseFS(embedMigrations)

// 	if err := goose.SetDialect("mysql"); err != nil {
// 		return fmt.Errorf("goose set SQL dialect failed: %w", err)
// 	}

// 	// This runs all migrations in the 'migrations' directory
// 	if err := goose.Up(DB, "migrations"); err != nil {
// 		return fmt.Errorf("goose up failed: %w", err)
// 	}

// 	return nil
// }

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
		log.Println("Note: No seed users needed password updates (already updated).")
		return nil
	}

	return nil
}
