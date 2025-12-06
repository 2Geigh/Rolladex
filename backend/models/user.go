package models

import (
	"gorm.io/gorm"
)

type RecievesNotificationsValue struct {
	Email             bool `json:"email"`
	PushNotifications bool `json:"push_notifications"`
}

type UiThemeMode string

const (
	Dark  UiThemeMode = "dark"
	Light UiThemeMode = "light"
	Auto  UiThemeMode = "auto"
)

type Settings struct {
	ReceivesNotifications RecievesNotificationsValue `json:"receivesNotifications"`
	UiTheme               UiThemeMode                `json:"ui_theme"`
}

type Email string

type User struct {
	gorm.Model

	Username string `json:"username"`
	Password string `json:"password"`
	Friends  *[]int `json:"friends"`
	// Meetups          *[]int     `json:"meetups"`
	// Settings         *Settings  `json:"settings"`
	// Email            *Email     `json:"email"`
	// ProfileImagePath *string    `json:"profile_image_path"`
	// Birthday         *time.Time `json:"birthday"`
	// LastInteraction  *time.Time `json:"last_interaction"`
	// LastMeetup       *time.Time `json:"last_meetup"`
}
