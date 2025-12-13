package handlers

import (
	"crypto/rand"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"math/big"
	"myfriends-backend/database"
	"myfriends-backend/models"
	"myfriends-backend/util"
	"net/http"

	"golang.org/x/crypto/bcrypt"
)

var (
	// Define pepper ASCII range
	PepperAsciiMax   = 126 // ~
	PepperAsciiMin   = 34  // "
	PepperAsciiRange = new(big.Int).SetInt64(int64(PepperAsciiMax - PepperAsciiMin))
)

func Signup(w http.ResponseWriter, req *http.Request) {

	util.LogHttpRequest(req)

	// CORS
	util.SetCORS(w)

	type SignupFormData struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if req.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
	}

	if req.Method == http.MethodPost {

		// Read request
		reqBody, err := io.ReadAll(req.Body)
		if err != nil {
			util.ReportHttpError(err, w, "failed to read request body", http.StatusInternalServerError)
			return
		}

		// Parse request
		var signupFormData SignupFormData
		err = json.Unmarshal(reqBody, &signupFormData)
		if err != nil {
			util.ReportHttpError(err, w, "failed to unmarshall request body JSON", http.StatusInternalServerError)
			return
		}
		user := models.User{
			Username: signupFormData.Username,
			Password: signupFormData.Password,
		}

		// Create new user
		err = RegisterUser(user)
		if err != nil {
			util.ReportHttpError(err, w, "couldn't insert user into database", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}

func RegisterUser(user models.User) error {
	var (
		err        error
		dbFilePath string = "database/myFriends.db"
	)

	// Connect to database
	DB, err := database.InitializeDB(dbFilePath)
	if err != nil {
		return fmt.Errorf("couldn't initialize database: %w", err)
	}
	defer DB.Close()

	// Check if user already exists in database
	userExists, err := UserExists(DB, user.Username)
	if err != nil {
		return fmt.Errorf("failed to check if user already exists in database: %w", err)
	}
	if userExists {
		return fmt.Errorf("user already exists in database")
	}

	// Prepare password for database storage
	hashedPassword, err := HashPassword(user.Password)
	if err != nil {
		return fmt.Errorf("failed to prepare password for database storage: %w", err)
	}

	// Add user to database
	stmt, err := DB.Prepare("INSERT INTO Users (username, password) VALUES (?, ?)")
	if err != nil {
		return fmt.Errorf("failed to add user to database: %w", err)
	}
	result, err := stmt.Exec(user.Username, hashedPassword)
	if err != nil {
		return fmt.Errorf("failed to add user to database: %v", err)
	}
	stmt.Close()

	// View SQL statement results
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	util.LogWithTimestamp(fmt.Sprintf("Registered \033[3m%v\033[0m as a user (Affected %d rows)", user.Username, rowsAffected))
	return err
}

func UserExists(DB *sql.DB, username string) (bool, error) {

	var (
		count int
		err   error
	)

	// Prepare SQL statement
	stmt, err := DB.Prepare("SELECT COUNT(*) FROM Users WHERE Username = ?")
	if err != nil {
		return false, fmt.Errorf("failed to prepare SQL statement: %v", err)
	}
	defer stmt.Close()

	// Execute the query
	err = stmt.QueryRow(username).Scan(&count)
	if err != nil {
		if err == sql.ErrNoRows {
			// No user found, return false
			return false, nil
		}
		return false, fmt.Errorf("failed to execute query: %v", err)
	}

	// Check if count is greater than 0
	return count > 0, nil
}

func HashPassword(password string) (string, error) {
	var (
		err        error
		costFactor int = bcrypt.DefaultCost
	)

	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), costFactor)
	if err != nil {
		err = fmt.Errorf("could not hash password: %w", err)
	}

	return string(hashedBytes), err
}

func PepperPassword(password string) (string, error) {

	// Generate random pepper
	pepperBigInt, err := rand.Int(rand.Reader, PepperAsciiRange)
	if err != nil {
		return "", err
	}

	// Convert random pepper *big.Int into a rune
	pepperInt32 := int32(pepperBigInt.Int64())
	pepperRune := rune(pepperInt32)

	// Pepper the password
	pepperedPassword := password + string(pepperRune)

	return pepperedPassword, err

}
