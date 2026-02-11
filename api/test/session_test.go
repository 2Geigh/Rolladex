package test

import (
	"rolladex-backend/models"
	"testing"
	"unicode/utf8"
)

func TestGenerateSessionToken(t *testing.T) {
	testCases := []struct {
		length     int64
		validInput bool
		errMsg     string
	}{
		{0, false, "argument must be a positive, non-zero int64"},
		{1, true, ""},
		{255, true, ""},
		{256, false, "argument must be less than 256"},
		{9223372036854775807, false, "argument must be less than 256"}, // highest value int64 can hold
	}

	for _, testCase := range testCases {
		result, err := models.GenerateSessionToken(testCase.length)

		if !testCase.validInput {
			if err == nil {
				t.Errorf("GenerateSessionToken(%v) = %v; want an error", testCase.length, result)
			} else if err.Error() != testCase.errMsg {
				t.Errorf("GenerateSessionToken(%v) error = %q; want %q", testCase.length, err.Error(), testCase.errMsg)
			}
		} else {
			if err != nil {
				t.Errorf("GenerateSessionToken(%v) = %v; want no error", testCase.length, err)
			}

			if utf8.RuneCountInString(result) != int(testCase.length) {
				t.Errorf("len(GenerateSessionToken(%v)) == %v, want %v", testCase.length, utf8.RuneCountInString(result), testCase.length)
			}
		}
	}
}
