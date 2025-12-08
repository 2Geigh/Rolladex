package models

import (
	"time"
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
	ID             uint      `gorm:"primaryKey;autoIncrement:true"`
	Username       string    `gorm:"type:text;not null"`
	Password       string    `gorm:"type:text;not null"`
	Email          Email     `gorm:"type:text"`
	ProfileImageID *uint     `gorm:"foreignKey:ID;constraint:OnUpdate:NO ACTION,OnDelete:NO ACTION"`
	Birthday       time.Time `gorm:"type:text"`
	UserSettingsID *uint     `gorm:"foreignKey:ID;constraint:OnUpdate:NO ACTION,OnDelete:NO ACTION"`
	CreatedAt      time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt      time.Time `gorm:"default:CURRENT_TIMESTAMP"`
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
