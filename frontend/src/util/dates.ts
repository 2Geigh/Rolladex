import { parseISO, isValid, differenceInDays } from "date-fns"

export function ValidateDate(dateString: string): boolean {
	const date = parseISO(dateString)
	return isValid(date)
}

export function DaysSinceDate(date: Date): number {
	const previous_date = new Date(date)
	const today = new Date()

	return differenceInDays(today, previous_date)
}

export function TimeAgo(date: Date | undefined): string {
	if (date === undefined) {
		return "unspecified time"
	}

	if (!(date instanceof Date) || isNaN(date.getTime())) {
		return "unknown time"
	}

	const now = new Date()
	const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000)

	const minutesAgo = Math.floor(secondsAgo / 60)
	const hoursAgo = Math.floor(minutesAgo / 60)
	const daysAgo = Math.floor(hoursAgo / 24)
	const weeksAgo = Math.floor(daysAgo / 7)
	const yearsAgo = Math.floor(daysAgo / 365)

	// Determine the largest time unit
	if (yearsAgo >= 1) {
		return `${yearsAgo} year${yearsAgo > 1 ? "s" : ""}`
	} else if (weeksAgo >= 1) {
		return `${weeksAgo} week${weeksAgo > 1 ? "s" : ""}`
	} else if (daysAgo >= 1) {
		return `${daysAgo} day${daysAgo > 1 ? "s" : ""}`
	} else if (hoursAgo >= 1) {
		return `${hoursAgo} hour${hoursAgo > 1 ? "s" : ""}`
	} else if (minutesAgo >= 1) {
		return `${minutesAgo} minute${minutesAgo > 1 ? "s" : ""}`
	} else {
		return `Just now`
	}
}
