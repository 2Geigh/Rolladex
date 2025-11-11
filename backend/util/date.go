package util

import (
	"fmt"
	"unicode"
)

func ValidateDate(date string) error {

	var err error

	// Validate string size
	if len(date) != 10 {
		return fmt.Errorf("Date string of incorrect size.")
	}

	// Validate string composition
	for i, r := range date {
		if i == 4 || i == 7 {
			if string(r) != "-" {
				return fmt.Errorf("Date should be form form 'YYYY-MM-DD': Missing '-'s.")
			}
		} else {
			if !unicode.IsNumber(r) {
				return fmt.Errorf("Date should be form form 'YYYY-MM-DD': Rune at index %d must be a number", i)
			}
		}
	}

	return err

}

type Date struct {
	Year  int `json:"year"`
	Month int `json:"month"`
	Day   int `json:"day"`
}
