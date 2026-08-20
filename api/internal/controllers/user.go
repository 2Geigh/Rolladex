package controllers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"rolladex/internal/database"
	"rolladex/internal/util"
)

type signupFormData struct {
	username              string
	password              string
	agreedToTOS           bool
	agreedToPrivacyPolicy bool
}

func CreateUser(req *http.Request) (int, error) {

	err := req.ParseForm()
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("parse singup form failed: %w", err)
	}

	signupData := signupFormData{
		username:              req.Form["username"][0],
		password:              req.Form["password"][0],
		agreedToTOS:           req.Form["tos-agree"][0] == "on",
		agreedToPrivacyPolicy: req.Form["privacy-agree"][0] == "on",
	}

	if !signupData.agreedToPrivacyPolicy {
		return http.StatusBadRequest, fmt.Errorf("private policy agreement required")
	}

	if !signupData.agreedToTOS {
		return http.StatusBadRequest, fmt.Errorf("terms of service agreement required")
	}

	const (
		maxPasswordLength = 255
		maxUsernameLength = 255
	)

	if len(signupData.username) > maxUsernameLength {
		return http.StatusRequestEntityTooLarge, fmt.Errorf("inputted username too long (max %d characters)", maxUsernameLength)
	}
	if len(signupData.password) > maxPasswordLength {
		return http.StatusRequestEntityTooLarge, fmt.Errorf("inputted password too long (max %d characters)", maxPasswordLength)
	}

	userExists, err := UserExists(database.DB, signupData.username)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("failed to verify user %s exists in database: %w", signupData.username, err)
	}
	if userExists {
		return http.StatusConflict, fmt.Errorf("username %s already taken", signupData.username)
	}

	statusCode, err := insertUserIntoDB(signupData)
	if err != nil {
		return statusCode, fmt.Errorf("insert user data into database failed: %w", err)
	}

	return http.StatusOK, nil
}

func UserExists(DB *sql.DB, username string) (bool, error) {

	var (
		count int
		err   error
	)

	stmt, err := DB.Prepare(`SELECT COUNT(*) FROM Users WHERE username = $1;`)
	if err != nil {
		return false, fmt.Errorf("failed to prepare SQL statement: %v", err)
	}
	defer stmt.Close()

	err = stmt.QueryRow(username).Scan(&count)
	if err != nil {
		if err == sql.ErrNoRows {
			// No user found, return false
			return false, nil
		}
		return false, fmt.Errorf("failed to execute query: %v", err)
	}

	return count > 0, nil
}

func insertUserIntoDB(signupData signupFormData) (int, error) {
	var (
		passwordSalt string
		passwordHash string
		err          error
	)

	passwordSalt, err = util.GenerateSalt(util.SaltLength)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("salt password failed: %w", err)
	}

	saltedPassword := signupData.password + passwordSalt
	passwordHash, err = util.HashPassword(saltedPassword)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("hash salted password failed: %w", err)
	}

	// We're wrapping the insert in a transaction
	// just in case someone happens to be deleting
	// a user of the same name at the same time
	// or some other conflict like that we wan't to
	// protect against #thinkingDefensively

	tx, err := database.DB.Begin()
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("begin tx: %w", err)
	}
	defer tx.Rollback()
	stmt, err := tx.Prepare(`INSERT INTO Users (username, passwordHash, passwordSalt) VALUES ($1, $2, $3);`)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("prepare user database insertion statement failed: %w", err)
	}
	defer stmt.Close()
	result, err := stmt.Exec(signupData.username, passwordHash, passwordSalt)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("execute user database insertion statement failed: %v", err)
	}
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return http.StatusInternalServerError, err
	}
	err = tx.Commit()
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("commit user database insertion transaction failed: %w", err)
	}

	log.Printf("Registered user %s, affecting %d row(s)", util.Italicize(signupData.username), rowsAffected)
	return http.StatusOK, err
}
