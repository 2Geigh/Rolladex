package util

var (
	dateFormatLayout = "2006-01-02 15:04:05"
)

// func LogWithTimestamp(object any) {
// 	now := time.Now()
// 	local := now.Local()
// 	formattedDateTime := local.Format(dateFormatLayout)

// 	// utc := now.UTC()
// 	// formattedDateTime := utc.Format(dateFormatLayout)

// 	log.Printf("%v: %v\n", formattedDateTime, object)
// 	log.Printf("[%s] %v\n", formattedDateTime, object) // No double timestamp
// }
