package util

import (
	"fmt"
	"unicode"
)

func IsEmpty(s string) bool {
	for _, runeValue := range s {
		if !unicode.IsSpace(runeValue) {
			return false
		}
	}
	return true
}

func Italicize(s string) string {
	return fmt.Sprintf("\033[3m%s\033[3m", s)
}
