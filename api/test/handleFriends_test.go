package test

import "rolladex-backend/models"

type testCase struct {
	friend   models.Friend
	expected float64
	errMsg   string
}

// var (
// 	zeroDaysAgoCases = []testCase{
// 		{
// 			friend: models.Friend{
// 				RelationshipTier: 1,                           // "inner clique"
// 				LastInteraction:  time.Now().AddDate(0, 0, 0), // 0 days ago
// 			},
// 			expected: 0, // should trigger no urgency
// 			errMsg:   "",
// 		},
// 		{
// 			friend: models.Friend{
// 				RelationshipTier: 2,                           // "close friends"
// 				LastInteraction:  time.Now().AddDate(0, 0, 0), // 0 days ago
// 			},
// 			expected: 0, // should trigger no urgency
// 			errMsg:   "",
// 		},
// 		{
// 			friend: models.Friend{
// 				RelationshipTier: 3,                           // "ordinary friends"
// 				LastInteraction:  time.Now().AddDate(0, 0, 0), // 0 days ago
// 			},
// 			expected: 0, // should trigger no urgency
// 			errMsg:   "",
// 		},
// 		{
// 			friend: models.Friend{
// 				RelationshipTier:    4,                           // "acquaintances"
// 				LastInteractionDate: time.Now().AddDate(0, 0, 0), // 0 days ago
// 			},
// 			expected: 0, // should trigger no urgency
// 			errMsg:   "",
// 		}}
// 	futureCases = []testCase{
// 		{
// 			friend: models.Friend{
// 				RelationshipTier:    1,                           // "inner clique"
// 				LastInteractionDate: time.Now().AddDate(0, 0, 1), // 8 days ago
// 			},
// 			expected: 0.00, // should trigger no urgency
// 			errMsg:   "last interaction/meetup date can't be in the future",
// 		},
// 		{
// 			friend: models.Friend{
// 				RelationshipTier:    2,                           // "close friends"
// 				LastInteractionDate: time.Now().AddDate(0, 2, 0), // 8 days ago
// 			},
// 			expected: 0.00, // should trigger no urgency
// 			errMsg:   "last interaction/meetup date can't be in the future",
// 		},
// 		{
// 			friend: models.Friend{
// 				RelationshipTier:    3,                           // "ordinary friends"
// 				LastInteractionDate: time.Now().AddDate(3, 0, 0), // 8 days ago
// 			},
// 			expected: 0.00, // should trigger no urgency
// 			errMsg:   "last interaction/meetup date can't be in the future",
// 		},
// 		{
// 			friend: models.Friend{
// 				RelationshipTier:    4,                           // "acquaintances"
// 				LastInteractionDate: time.Now().AddDate(9, 9, 9), // 8 days ago
// 			},
// 			expected: 0.00, // should trigger no urgency
// 			errMsg:   "last interaction/meetup date can't be in the future",
// 		}}
// 	boundaryCases = []testCase{
// 		{
// 			friend: models.Friend{
// 				RelationshipTier:    1,                            // "inner clique"
// 				LastInteractionDate: time.Now().AddDate(0, 0, -8), // 8 days ago
// 			},
// 			expected: 1, // should trigger max urgency
// 			errMsg:   "",
// 		},
// 		{
// 			friend: models.Friend{
// 				RelationshipTier:    2,                             // "close friends"
// 				LastInteractionDate: time.Now().AddDate(0, 0, -32), // 32 days ago
// 			},
// 			expected: 1, // should trigger max urgency
// 			errMsg:   "",
// 		},
// 		{
// 			friend: models.Friend{
// 				RelationshipTier:    3,                              // "ordinary friends"
// 				LastInteractionDate: time.Now().AddDate(0, 0, -366), // 366 days ago
// 			},
// 			expected: 1, // should trigger max urgency
// 			errMsg:   "",
// 		},
// 		{
// 			friend: models.Friend{
// 				RelationshipTier:    4,                              // "acquaintances"
// 				LastInteractionDate: time.Now().AddDate(0, 0, -731), // 731 days ago
// 			},
// 			expected: 1, // should trigger max urgency
// 			errMsg:   "",
// 		},
// 	}
// 	longTimeAgoCases = []testCase{
// 		{
// 			friend: models.Friend{
// 				RelationshipTier:    1,                                 // "inner clique"
// 				LastInteractionDate: time.Now().AddDate(-9999, -9, -9), // A long time ago
// 			},
// 			expected: 1, // should trigger max urgency
// 			errMsg:   "",
// 		},
// 		{
// 			friend: models.Friend{
// 				RelationshipTier:    2,                                 // "close friends"
// 				LastInteractionDate: time.Now().AddDate(-9999, -9, -9), // A long time ago
// 			},
// 			expected: 1, // should trigger max urgency
// 			errMsg:   "",
// 		},
// 		{
// 			friend: models.Friend{
// 				RelationshipTier:    3,                                 // "ordinary friends"
// 				LastInteractionDate: time.Now().AddDate(-9999, -9, -9), // A long time ago
// 			},
// 			expected: 1, // should trigger max urgency
// 			errMsg:   "",
// 		},
// 		{
// 			friend: models.Friend{
// 				RelationshipTier:    4,                                 // "acquaintances"
// 				LastInteractionDate: time.Now().AddDate(-9999, -9, -9), // A long time ago
// 			},
// 			expected: 1, // should trigger max urgency
// 			errMsg:   "",
// 		},
// 	}

// 	GetUrgencyScore_TestCases = slices.Concat(zeroDaysAgoCases, futureCases, boundaryCases, longTimeAgoCases)
// )

// func TestGetUrgencyScore(t *testing.T) {

// 	for _, testCase := range GetUrgencyScore_TestCases {
// 		result, err := handlers.GetUrgencyScore(testCase.friend)

// 		if result != testCase.expected {
// 			t.Errorf("GetUrgencyScore(%v) == %v, want %v", testCase.friend, result, testCase.expected)
// 		}

// 		// Check if the error message matches the expected error message
// 		if result != testCase.expected && err != nil {
// 			if err.Error() != testCase.errMsg {
// 				t.Errorf("GetUrgencyScore(%q) error = %q; want %q", testCase.friend, err.Error(), testCase.errMsg)
// 			}
// 		} else if testCase.errMsg == "" && err != nil {
// 			t.Errorf("GetUrgencyScore(%q) = %v; want no error", testCase.friend, err)
// 		}
// 	}
// }
