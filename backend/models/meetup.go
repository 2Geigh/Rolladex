package models

import (
	"time"
)

type Meetup struct {
	ID          uint      `gorm:"primaryKey;autoIncrement:true"`
	Date        time.Time `gorm:"not null;type:text"`
	Location    string    `gorm:"type:text"`
	Name        string    `gorm:"type:text"`
	OrganizerID uint      `gorm:"constraint:OnUpdate:NO ACTION,OnDelete:CASCADE"`
	CreatedAt   time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt   time.Time `gorm:"default:CURRENT_TIMESTAMP"`
}

type MeetupAttendee struct {
	ID        uint      `gorm:"primaryKey;autoIncrement:true"`
	MeetupID  uint      `gorm:"constraint:OnUpdate:NO ACTION,OnDelete:CASCADE"`
	FriendID  uint      `gorm:"constraint:OnUpdate:NO ACTION,OnDelete:CASCADE"`
	CreatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt time.Time `gorm:"default:CURRENT_TIMESTAMP"`
}

type Interaction struct {
	ID              uint      `gorm:"primaryKey;autoIncrement:true"`
	Date            time.Time `gorm:"not null;type:text"`
	UserID          uint      `gorm:"not null;constraint:OnUpdate:NO ACTION,OnDelete:CASCADE"`
	FriendID        uint      `gorm:"not null;constraint:OnUpdate:NO ACTION,OnDelete:NO ACTION"`
	InteractionType string    `gorm:"type:varchar"`
	CreatedAt       time.Time `gorm:"default:CURRENT_TIMESTAMP"`
	UpdatedAt       time.Time `gorm:"default:CURRENT_TIMESTAMP"`
}
