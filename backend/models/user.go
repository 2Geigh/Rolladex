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
	ID             uint      `json:"id"`
	Username       string    `json:"username"`
	PasswordHash   string    `json:"password_hash"`
	PasswordSalt   string    `json:"password_salt"`
	Email          Email     `json:"email"`
	ProfileImageID uint      `json:"profile_image_id"`
	Birthday       time.Time `json:"birthday"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type UsersFriend struct {
	ID                 uint      `gorm:"primaryKey;autoIncrement:true"`
	UserID             uint      `gorm:"not null"`
	FriendID           uint      `gorm:"not null;constraint:OnUpdate:NO ACTION,OnDelete:CASCADE"`
	CreatedAt          time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt          time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	RelationshipStatus string    `gorm:"type:text"`
}
