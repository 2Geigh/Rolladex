package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"myfriends-backend/database"
	"myfriends-backend/models"
	"myfriends-backend/util"
	"net/http"

	"gorm.io/gorm"
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
		log.Println(string(reqBody))

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

		// Establish database connection
		DB, err := database.InitializeDB()
		if err != nil {
			util.ReportHttpError(err, w, "database connection initialization failed", http.StatusInternalServerError)
			return
		}
		defer func() {
			err = database.CloseDB(DB)
			if err != nil {
				util.ReportHttpError(err, w, "database connection closure failed", http.StatusInternalServerError)
				return
			}
		}()

		// Create with result
		err = CreateUser(DB, user)
		if err != nil {
			util.ReportHttpError(err, w, "database entry creation failed", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}

func CreateUser(DB *gorm.DB, user models.User) error {
	var err error

	// Environmental setup
	ctx := context.Background()
	DB.AutoMigrate(&models.User{})
	result := gorm.WithResult()

	// Check if user already exists
	_, err = gorm.G[models.User](DB).Where("username = ?", user.Username).First(ctx)
	fmt.Printf(`haha: %v`, err)
	if err == nil {
		return fmt.Errorf("user already exists in database")
	}

	// Add user to database
	err = gorm.G[models.User](DB, result).Create(ctx, &user)
	if err != nil {
		return err
	}

	fmt.Printf("Added User '%s' to database, affecting %d rows", user.Username, result.RowsAffected)
	return err
}
