package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"myfriends-backend/database"
	"myfriends-backend/models"
	"myfriends-backend/util"
	"net/http"

	"gorm.io/gorm"
)

func Login(w http.ResponseWriter, req *http.Request) {
	util.LogHttpRequest(req)

	// CORS
	util.SetCORS(w)

	type LoginFormData struct {
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
		var signupFormData LoginFormData
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

		// Query result
		err, code := AuthenticateUser(DB, user.Username, user.Password)
		if err != nil {
			util.ReportHttpError(err, w, "user authentication failed", code)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}

func AuthenticateUser(DB *gorm.DB, username string, password string) (error, int) {
	var err error

	// Environmental setup
	ctx := context.Background()
	DB.AutoMigrate(&models.User{})

	// Check if user already exists
	user, err := gorm.G[models.User](DB).Where("username = ?", username).First(ctx)
	if err != nil {
		return fmt.Errorf(`user not found`), http.StatusBadRequest
	}

	// Check if inputted password matches that of the found user
	inputtedPassword := password
	userPassword := user.Password
	if inputtedPassword != userPassword {
		return fmt.Errorf("incorrect password"), http.StatusBadRequest
	}

	util.LogWithTimestamp(fmt.Sprintf(`%s logged in`, username))
	return err, http.StatusOK
}
