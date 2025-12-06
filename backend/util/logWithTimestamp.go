package util

import (
	"fmt"
	"time"
)

func LogWithTimestamp(object any) {
	fmt.Printf("%v: %v\n", time.Now().Format(time.DateTime), object)
}
