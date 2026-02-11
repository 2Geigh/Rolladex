package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"rolladex-backend/database"
	"rolladex-backend/util"
)

type signupFormData struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Signup(w http.ResponseWriter, req *http.Request) {

	// CORS
	util.SetCrossOriginResourceSharing(w, req)

	switch req.Method {

	case http.MethodOptions:
		w.WriteHeader(http.StatusNoContent)

	case http.MethodPost:
		createUser(w, req)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}

}

func createUser(w http.ResponseWriter, req *http.Request) {
	reqBody, err := io.ReadAll(req.Body)
	if err != nil {
		util.ReportHttpError(err, w, "failed to read request body", http.StatusInternalServerError)
		return
	}

	var signupData signupFormData
	err = json.Unmarshal(reqBody, &signupData)
	if err != nil {
		util.ReportHttpError(err, w, "failed to unmarshall request body JSON", http.StatusInternalServerError)
		return
	}

	if len(signupData.Username) > 255 {
		util.ReportHttpError(fmt.Errorf("inputted username too long"), w, "username can't be longer than 255 characters", http.StatusBadRequest)
		return
	}
	if len(signupData.Password) > 255 {
		util.ReportHttpError(fmt.Errorf("inputted password too long"), w, "password can't be longer than 255 characters", http.StatusBadRequest)
		return
	}

	statusCode, err := insertUserIntoDB(signupData)
	if err != nil {
		util.ReportHttpError(err, w, "couldn't create user", statusCode)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func insertUserIntoDB(signupData signupFormData) (int, error) {
	var (
		passwordSalt string
		passwordHash string
		err          error
	)

	userExists, err := UserExists(database.DB, signupData.Username)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("failed to check if user already exists in database: %w", err)
	}
	if userExists {
		return http.StatusConflict, fmt.Errorf("username already taken")
	}

	passwordSalt, err = util.GenerateSalt(util.SaltLength)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("could not salt password: %w", err)
	}

	passwordHash, err = util.HashPassword(signupData.Password + passwordSalt)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("could not hash salted password: %w", err)
	}

	tx, err := database.DB.Begin()
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("begin tx: %w", err)
	}
	defer tx.Rollback()
	stmt, err := tx.Prepare("INSERT INTO Users (username, passwordHash, passwordSalt) VALUES (?, ?, ?)")
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("failed to add user to database: %w", err)
	}
	defer stmt.Close()
	result, err := stmt.Exec(signupData.Username, passwordHash, passwordSalt)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("failed to add user to database: %v", err)
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return http.StatusInternalServerError, err
	}
	err = tx.Commit()
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("could not commit transaction: %w", err)
	}

	log.Println(fmt.Sprintf("Registered user \033[3m%s\033[0m, affecting %d row(s)", signupData.Username, rowsAffected))
	return http.StatusOK, err
}

func UserExists(DB *sql.DB, username string) (bool, error) {

	var (
		count int
		err   error
	)

	// Prepare SQL statement
	stmt, err := DB.Prepare("SELECT COUNT(*) FROM Users WHERE username = ?")
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
