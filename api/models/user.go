package models

import (
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

type Email string

type User struct {
	ID             uint          `json:"id"`
	Username       string        `json:"username"`
	PasswordHash   string        `json:"password_hash"`
	PasswordSalt   string        `json:"password_salt"`
	Email          Email         `json:"email"`
	ProfileImageID uint          `json:"profile_image_id"`
	BirthdayMonth  int           `json:"birthday_month"`
	BirthdayDay    int           `json:"birthday_day"`
	TimeZone       time.Location `json:"time_zone"`
	CreatedAt      time.Time     `json:"created_at"`
	UpdatedAt      time.Time     `json:"updated_at"`
}
