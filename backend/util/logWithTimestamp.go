package util

import (
	"log"
	"time"
)

func LogWithTimestamp(object any) {
	log.Printf("%v: %v\n", time.Now().Format(time.DateTime), object)
}
