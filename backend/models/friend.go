package models

import (
	"time"
)

type Friend struct {
	ID                  uint      `gorm:"primaryKey;autoIncrement;not null"`
	Name                string    `gorm:"not null;type:text"`
	LastMeetupDate      time.Time `gorm:"type:datetime"`
	LastInteractionDate time.Time `gorm:"type:datetime"`
	Birthday            time.Time `gorm:"type:date"`
	ProfileImageID      uint      `gorm:"foreignKey:ID;constraint:OnDelete:SET NULL"`
	RelationshipStatus  uint      `json:"relationship_status"`
	CreatedAt           time.Time `gorm:"autoCreateTime"`
	UpdatedAt           time.Time `gorm:"autoUpdateTime"`
}
