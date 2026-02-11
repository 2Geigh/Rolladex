package models

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"math/big"
	"strings"
	"time"
)

type Session struct {
	Id            int
	User_id       int
	Session_token string
	Created_at    time.Time
	Expires_at    time.Time
	Is_revoked    bool
}

func GenerateSessionToken(length int64) (string, error) {
	if length < 1 {
		return "", fmt.Errorf("argument must be a positive, non-zero int64")
	}

	if length > 255 {
		return "", fmt.Errorf("argument must be less than 256")
	}

	// Calculate the byte length for base64 output
	byteLength := (length * 3) / 4
	token := make([]byte, byteLength)

	_, err := rand.Read(token)
	if err != nil {
		return "", err // Return an empty string and the error
	}

	// Encode the bytes to a base64 URL-safe string
	encodedToken := base64.URLEncoding.EncodeToString(token)

	// Ensure the generated token matches the required length
	if len(encodedToken) > int(length) {
		encodedToken = encodedToken[:length]
	} else if len(encodedToken) < int(length) {
		randomFill, _ := generateRandomFill(int(length))
		encodedToken += randomFill
	}

	return encodedToken, nil
}

func generateRandomFill(length int) (string, error) {
	if length < 1 {
		return "", fmt.Errorf("length must be a positive integer")
	}

	const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_"
	token := make([]byte, length)

	for i := range token {
		// Generate a random index to select a character from chars
		r := strings.NewReader(chars)
		index, err := rand.Int(r, big.NewInt(int64(len(chars))))
		if err != nil {
			return "", err // Return error if failed to generate a random index
		}
		token[i] = chars[index.Int64()] // Use the generated index
	}

	return string(token), nil // Return the generated string and nil error
}
