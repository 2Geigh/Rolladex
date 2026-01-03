package test

import (
	"myfriends-backend/handlers"
	"myfriends-backend/models"
	"testing"
	"time"
)

func TestGetUrgencyScore(t *testing.T) {
	testCases := []struct {
		friend   models.Friend
		expected float64
		errMsg   string
	}{
		{
			friend: models.Friend{
				RelationshipStatus:  1,                            // "inner clique"
				LastInteractionDate: time.Now().AddDate(0, -1, 0), // 1 month ago
			},
			expected: 1.0, // should trigger max urgency
			errMsg:   "",
		},
		{
			friend: models.Friend{
				RelationshipStatus:  2,                            // "close friends"
				LastInteractionDate: time.Now().AddDate(0, -3, 0), // 3 months ago
			},
			expected: 0.9375, // (90/32)
			errMsg:   "",
		},
		{
			friend: models.Friend{
				RelationshipStatus:  3,                            // "ordinary friends"
				LastInteractionDate: time.Now().AddDate(0, -1, 0), // 1 year ago
			},
			expected: 1.0, // should trigger max urgency
			errMsg:   "",
		},
		{
			friend: models.Friend{
				RelationshipStatus:  4,                            // "friends / acquaintances"
				LastInteractionDate: time.Now().AddDate(-3, 0, 0), // 3 years ago
			},
			expected: 1.0, // should trigger max urgency
			errMsg:   "",
		},
		{
			friend: models.Friend{
				RelationshipStatus:  1,                            // "inner clique"
				LastInteractionDate: time.Now().AddDate(0, 0, -7), // 7 days ago
			},
			expected: 0.875, // (7/8)
			errMsg:   "",
		},
		{
			friend: models.Friend{
				RelationshipStatus:  2,                            // "close friends"
				LastInteractionDate: time.Now().AddDate(0, -2, 0), // 2 months ago
			},
			expected: 0.625, // (60/32)
			errMsg:   "",
		},
		{
			friend: models.Friend{
				RelationshipStatus:  3,                            // "ordinary friends"
				LastInteractionDate: time.Now().AddDate(0, -6, 0), // 6 months ago
			},
			expected: 0.5, // (180/366)
			errMsg:   "",
		},
		{
			friend: models.Friend{
				RelationshipStatus:  4,                            // "friends / acquaintances"
				LastInteractionDate: time.Now().AddDate(-1, 0, 0), // 1 year ago
			},
			expected: 0.5, // (365/731)
			errMsg:   "",
		},
		{
			friend: models.Friend{
				RelationshipStatus:  1,                           // "inner clique"
				LastInteractionDate: time.Now().AddDate(0, 0, 1), // 1 day in future (should give error)
			},
			expected: 0.0,
			errMsg:   "incorrect calculation for days since last interaction (computed negative value)",
		},
	}

	for _, testCase := range testCases {
		result, err := handlers.GetUrgencyScore(testCase.friend)

		if result != testCase.expected {
			t.Errorf("GetUrgencyScore(%v) == %v, want %v", testCase.friend, result, testCase.expected)
		}

		// Check if the error message matches the expected error message
		if result != testCase.expected && err != nil {
			if err.Error() != testCase.errMsg {
				t.Errorf("GetUrgencyScore(%q) error = %q; want %q", testCase.friend, err.Error(), testCase.errMsg)
			}
		} else if result == testCase.expected && err != nil {
			t.Errorf("GetUrgencyScore(%q) = %v; want no error", testCase.friend, err)
		}
	}
}
