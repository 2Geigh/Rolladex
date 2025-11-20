package util

import (
	"testing"
)

func TestIsValidDate(t *testing.T) {
	testCases := []struct {
		date     string
		expected bool
		errMsg   string
	}{
		{"2003-10-10", true, ""},
		{"2021-01-01", true, ""},
		{"2003-10-10", true, ""},
		{"2003-10-1", false, "Date string of incorrect size."},
		{"2003-10-100", false, "Date string of incorrect size."},
		{"2003/10/10", false, "Date should be in the form 'YYYY-MM-DD': Missing '-'s."},
		{"20031010", false, "Date string of incorrect size."},
		{"2003-1a-10", false, "Date should be in the form 'YYYY-MM-DD': Rune at index 5 must be a number"},
		{"20a3-10-10", false, "Date should be in the form 'YYYY-MM-DD': Rune at index 2 must be a number"},
	}

	for _, testCase := range testCases {
		result, err := IsValidDate(testCase.date)

		if result != testCase.expected {
			t.Errorf("IsValidDate(%v) == %v, want %v", testCase.date, result, testCase.expected)
		}

		// Check if the error message matches the expected error message
		if testCase.expected == false && err != nil {
			if err.Error() != testCase.errMsg {
				t.Errorf("IsValidateDate(%q) error = %q; want %q", testCase.date, err.Error(), testCase.errMsg)
			}
		} else if testCase.expected == true && err != nil {
			t.Errorf("IsValidateDate(%q) = %v; want no error", testCase.date, err)
		}
	}
}
