package models

import (
	"database/sql"
	"fmt"
	"myfriends-backend/database"
	"time"

	_ "modernc.org/sqlite"
)

type NotificationPreference struct {
	ID               uint `gorm:"primaryKey;autoIncrement:true"`
	UserID           uint `gorm:"constraint:OnUpdate:NO ACTION,OnDelete:NO ACTION"`
	Email            bool `gorm:"default:false"`
	SMS              bool `gorm:"default:false"`
	PushNotification bool `gorm:"default:false"`
}

type UiThemeMode string

const (
	Dark  UiThemeMode = "dark"
	Light UiThemeMode = "light"
	Auto  UiThemeMode = "auto"
)

type Setting struct {
	ID                        uint      `gorm:"primaryKey;autoIncrement:true"`
	UserID                    uint      `gorm:"constraint:OnUpdate:NO ACTION,OnDelete:NO ACTION"`
	NotificationPreferencesID *uint     `gorm:"foreignKey:ID;constraint:OnUpdate:NO ACTION,OnDelete:NO ACTION"`
	UiTheme                   string    `gorm:"type:varchar"`
	CreatedAt                 time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt                 time.Time `gorm:"default:CURRENT_TIMESTAMP"`
}

type Email string

type User struct {
	ID             uint
	Username       string
	Password       string
	Email          Email
	ProfileImageID *uint
	Birthday       time.Time
	UserSettingsID *uint
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

type UsersFriend struct {
	ID                 uint      `gorm:"primaryKey;autoIncrement:true"`
	UserID             uint      `gorm:"not null"`
	FriendID           uint      `gorm:"not null;constraint:OnUpdate:NO ACTION,OnDelete:CASCADE"`
	CreatedAt          time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt          time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	RelationshipStatus string    `gorm:"type:text"`
}

type Session struct {
	ID           uint       `gorm:"primaryKey;autoIncrement:true"`
	UserID       uint       `gorm:"constraint:OnUpdate:NO ACTION,OnDelete:CASCADE"`
	SessionToken string     `gorm:"not null;type:text"`
	CreatedAt    time.Time  `gorm:"default:CURRENT_TIMESTAMP"`
	ExpiresAt    *time.Time `gorm:"type:datetime"`
}

func RegisterUser(user User) error {
	var (
		err        error
		dbFilePath string = "database/myFriends.db"
	)

	// Connect to database
	DB, err := database.InitializeDB(dbFilePath)
	if err != nil {
		return fmt.Errorf("couldn't initialize database: %v", err)
	}
	defer DB.Close()

	// Check if user already exists in database
	userExists, err := UserExists(DB, user.Username)
	if err != nil {
		return fmt.Errorf("failed to check if user already exists in database: %v", err)
	}
	if userExists {
		return fmt.Errorf("user already exists in database")
	}

	// Add user to database
	stmt, err := DB.Prepare("INSERT INTO Users (username, password) VALUES (?, ?)")
	if err != nil {
		return fmt.Errorf("failed to add user to database: %v", err)
	}
	result, err := stmt.Exec(user.Username, user.Password)
	if err != nil {
		return fmt.Errorf("failed to add user to database: %v", err)
	}
	stmt.Close()

	// View SQL statement results
	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	fmt.Printf("Registered \033[3m%v\033[0m as a user (Affected %d rows)\n", user.Username, rowsAffected)
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
