package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"rolladex/internal/database"
	"rolladex/internal/templating"
	"rolladex/internal/util"
)

type signupFormData struct {
	username              string
	password              string
	agreedToTOS           bool
	agreedToPrivacyPolicy bool
}

func Signup(w http.ResponseWriter, req *http.Request) {

	switch req.Method {

	case http.MethodOptions:
		w.WriteHeader(http.StatusNoContent)

	case http.MethodGet:
		data := struct{ Title string }{Title: "Signup | Rolladex"}

		err := templating.RenderUnprotectedPage(w, "web/template/pages/Signup.html", data)
		if err != nil {
			util.ReportHttpError(err, w, "render page failed: %w", http.StatusInternalServerError)
			return
		}

	case http.MethodPost:
		statusCode, err := createUser(req)
		if err != nil {
			w.WriteHeader(statusCode)
			fmt.Fprint(w, err)
			return
		}

		http.Redirect(w, req, "/login", http.StatusOK)

	default:
		w.WriteHeader(http.StatusMethodNotAllowed)
	}

}

func createUser(req *http.Request) (int, error) {

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

	passwordHash, err = util.HashPassword(signupData.password + passwordSalt)
	if err != nil {
		return http.StatusInternalServerError, fmt.Errorf("hash salted password failed: %w", err)
	}

	// tx, err := database.DB.Begin()
	// if err != nil {
	// 	return http.StatusInternalServerError, fmt.Errorf("begin tx: %w", err)
	// }
	// defer tx.Rollback()
	// stmt, err := tx.Prepare("INSERT INTO Users (username, passwordHash, passwordSalt) VALUES (?, ?, ?)")
	// if err != nil {
	// 	return http.StatusInternalServerError, fmt.Errorf("failed to add user to database: %w", err)
	// }
	// defer stmt.Close()
	// result, err := stmt.Exec(signupData.username, passwordHash, passwordSalt)
	// if err != nil {
	// 	return http.StatusInternalServerError, fmt.Errorf("failed to add user to database: %v", err)
	// }
	// rowsAffected, err := result.RowsAffected()
	// if err != nil {
	// 	return http.StatusInternalServerError, err
	// }
	// err = tx.Commit()
	// if err != nil {
	// 	return http.StatusInternalServerError, fmt.Errorf("could not commit transaction: %w", err)
	// }

	// log.Printf("Registered user \033[3m%s\033[0m, affecting %d row(s)", signupData.username, rowsAffected)
	return http.StatusOK, err
}

func UserExists(DB *sql.DB, username string) (bool, error) {

	var (
		count int
		err   error
	)

	stmt, err := DB.Prepare("SELECT COUNT(*) FROM Users WHERE username = ?")
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
