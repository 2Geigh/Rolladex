package logic

import (
	"fmt"
	"rolladex-backend/models"
	"rolladex-backend/util"
	"time"
)

func GetRelationshipUrgency(friend_id int, user_id string) (float64, error) {
	var (
		relationshipUrgency float64

		daysSinceLastInteraction float64
		birthdayMonth            int
		birthdayDay              int

		err error
	)

	daysSinceLastInteraction, err = models.GetDaysSinceLastInteraction(friend_id, user_id)
	if err != nil {
		return relationshipUrgency, fmt.Errorf("couldn't get days since last interaction: %w", err)
	}

	relationshipTier, err := models.GetRelationshipTier(friend_id, user_id)
	if err != nil {
		return relationshipUrgency, fmt.Errorf("couldn't get relationship tier: %w", err)
	}

	birthdayMonth, birthdayDay, err = models.GetBirthday(friend_id)
	if err != nil {
		birthdayMonth, birthdayDay = 0, 0
	}
	today := time.Now()
	isBirthdayToday := birthdayMonth == int(today.Month()) && birthdayDay == today.Day()
	if isBirthdayToday {
		return 1.0, nil
	}

	relationshipUrgency = daysSinceLastInteraction / float64(relationshipTier)
	relationshipUrgency, err = util.SigmoidForPositiveInputs(relationshipUrgency)

	return relationshipUrgency, err
}
