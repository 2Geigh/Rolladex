package util

import "unicode"

func IsEmpty(s string) bool {
	for _, runeValue := range s {
		if !unicode.IsSpace(runeValue) {
			return false
		}
	}
	return true
}
