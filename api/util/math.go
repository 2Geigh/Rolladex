package util

import (
	"fmt"
	"math"
)

func Sigmoid(number float64) float64 {
	return (1 / (1 + math.Pow(math.E, -(number))))
}

func SigmoidForPositiveInputs(natural_number float64) (float64, error) {
	if natural_number < 0 {
		return -1, fmt.Errorf("input must be a positive real number")
	}

	return ((2 / (1 + math.Pow(math.E, (-(natural_number))))) - 1), nil
}
