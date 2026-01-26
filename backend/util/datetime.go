package util

import (
	"fmt"
	"time"
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
				return false, fmt.Errorf("date should be in the form 'YYYY-MM-DD': missing '-'s")
			}
		} else {
			if !unicode.IsNumber(r) {
				return false, fmt.Errorf("date should be in the form 'YYYY-MM-DD': rune at index %d must be a number", i)
			}
		}
	}

	return true, err

}

var DatetimeFormat string = "2006-01-02 15:04:05"

func DateEqual(date1, date2 time.Time) bool {
	y1, m1, d1 := date1.Date()
	y2, m2, d2 := date2.Date()
	return y1 == y2 && m1 == m2 && d1 == d2
}
