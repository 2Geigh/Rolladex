package util

import (
	"fmt"
	"unicode"
)

func IsValidDate(date string) (bool, error) {

	var err error

	// Validate string size
	if len(date) != 10 {
		return false, fmt.Errorf("date string of incorrect size")
	}

	// Validate string composition
	for i, r := range date {
		if i == 4 || i == 7 {
			if string(r) != "-" {
				return false, fmt.Errorf("date should be form form 'YYYY-MM-DD': missing '-'s")
			}
		} else {
			if !unicode.IsNumber(r) {
				return false, fmt.Errorf("ate should be form form 'YYYY-MM-DD': Rune at index %d must be a number", i)
			}
		}
	}

	return true, err

}

type Date struct {
	Year  int `json:"year"`
	Month int `json:"month"`
	Day   int `json:"day"`
}
