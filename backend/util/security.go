package util

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"

	"golang.org/x/crypto/bcrypt"
)

var (
	SaltLength = 32
)

func HashPassword(password string) (string, error) {
	var (
		err        error
		costFactor int = bcrypt.DefaultCost
	)

	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), costFactor)
	if err != nil {
		err = fmt.Errorf("could not hash password: %w", err)
	}

	return string(hashedBytes), err
}

func GenerateSalt(length int) (string, error) {

	var (
		salt       []byte
		saltString string
		err        error
	)

	salt = make([]byte, length)

	_, err = rand.Read(salt)
	if err != nil {
		return saltString, fmt.Errorf("generate salt failed: %w", err)
	}

	saltString = base64.StdEncoding.EncodeToString(salt)
	return saltString, err

}
