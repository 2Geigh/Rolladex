import { parseISO, isValid, differenceInDays } from 'date-fns';

export const clientTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const clientTimeZoneOffset = new Date().getTimezoneOffset();

export function ValidateDate(dateString: string): boolean {
	const date = parseISO(dateString);
	return isValid(date);
}

export function DaysSinceDate(date: Date): number {
	const previous_date = new Date(date);
	const today = new Date();

	return differenceInDays(today, previous_date);
}

export function TimeAgo(date: Date | undefined): string {
	if (date === undefined) {
		return 'Unspecified';
	}

	const secondsSinceDate = new Date(date).getTime();
	if (isNaN(secondsSinceDate)) {
		return 'Unknown';
	}

	const now = new Date();
	const secondsAgo = Math.floor((now.getTime() - secondsSinceDate) / 1000);

	const minutesAgo = Math.floor(secondsAgo / 60);
	const hoursAgo = Math.floor(minutesAgo / 60);
	const daysAgo = Math.floor(hoursAgo / 24);
	const weeksAgo = Math.floor(daysAgo / 7);
	const yearsAgo = Math.floor(daysAgo / 365);

	// Determine the largest time unit
	if (yearsAgo >= 1) {
		return `${yearsAgo} year${yearsAgo > 1 ? 's' : ''}`;
	} else if (weeksAgo >= 1) {
		return `${weeksAgo} week${weeksAgo > 1 ? 's' : ''}`;
	} else if (daysAgo >= 1) {
		return `${daysAgo} day${daysAgo > 1 ? 's' : ''}`;
	} else if (hoursAgo >= 1) {
		return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''}`;
	} else if (minutesAgo >= 1) {
		return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''}`;
	} else {
		return `Just now`;
	}
}

export function GetZodiac(
	month: string | null | number | undefined,
	day: string | null | number | undefined
): Record<string, string> {
	if (
		!month ||
		!day ||
		String(month).trim() === '' ||
		String(day).trim() === ''
	) {
		return { zodiacName: 'No birthday selected yet', zodiacEmoji: '🎂' };
	}

	const monthString =
		typeof month === 'number' ? month.toString().padStart(2, '0') : month;
	const dayNumber =
		typeof day === 'number' ? day : parseInt(day as string, 10);

	if (monthString === '01')
		return dayNumber < 20 ?
				{ zodiacName: 'Capricorn', zodiacEmoji: '🐐' }
			:	{ zodiacName: 'Aquarius', zodiacEmoji: '🏺' };
	if (monthString === '02')
		return dayNumber < 19 ?
				{ zodiacName: 'Aquarius', zodiacEmoji: '🏺' }
			:	{ zodiacName: 'Pisces', zodiacEmoji: '🐟' };
	if (monthString === '03')
		return dayNumber < 21 ?
				{ zodiacName: 'Pisces', zodiacEmoji: '🐟' }
			:	{ zodiacName: 'Aries', zodiacEmoji: '🐏' };
	if (monthString === '04')
		return dayNumber < 20 ?
				{ zodiacName: 'Aries', zodiacEmoji: '🐏' }
			:	{ zodiacName: 'Taurus', zodiacEmoji: '🐂' };
	if (monthString === '05')
		return dayNumber < 21 ?
				{ zodiacName: 'Taurus', zodiacEmoji: '🐂' }
			:	{ zodiacName: 'Gemini', zodiacEmoji: '👯' };
	if (monthString === '06')
		return dayNumber < 21 ?
				{ zodiacName: 'Gemini', zodiacEmoji: '👯' }
			:	{ zodiacName: 'Cancer', zodiacEmoji: '🦀' };
	if (monthString === '07')
		return dayNumber < 23 ?
				{ zodiacName: 'Cancer', zodiacEmoji: '🦀' }
			:	{ zodiacName: 'Leo', zodiacEmoji: '🦁' };
	if (monthString === '08')
		return dayNumber < 23 ?
				{ zodiacName: 'Leo', zodiacEmoji: '🦁' }
			:	{ zodiacName: 'Virgo', zodiacEmoji: '🍒' };
	if (monthString === '09')
		return dayNumber < 23 ?
				{ zodiacName: 'Virgo', zodiacEmoji: '🍒' }
			:	{ zodiacName: 'Libra', zodiacEmoji: '⚖️' };
	if (monthString === '10')
		return dayNumber < 23 ?
				{ zodiacName: 'Libra', zodiacEmoji: '⚖️' }
			:	{ zodiacName: 'Scorpio', zodiacEmoji: '🦂' };
	if (monthString === '11')
		return dayNumber < 22 ?
				{ zodiacName: 'Scorpio', zodiacEmoji: '🦂' }
			:	{ zodiacName: 'Sagittarius', zodiacEmoji: '🏹' };
	if (monthString === '12')
		return dayNumber < 22 ?
				{ zodiacName: 'Sagittarius', zodiacEmoji: '🏹' }
			:	{ zodiacName: 'Capricorn', zodiacEmoji: '🐐' };

	return {};
}

export function MonthNumberToString(
	month_number: number | undefined | null
): string {
	if (!month_number) {
		return 'Unknown';
	}

	const month_index = month_number - 1;
	if (month_index < 0 || month_index > 11) {
		return 'Undefined';
	}

	const month_names = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	return month_names[month_index];
}

export function GetMaxDaysInMonth(month: string | null) {
	if (!month) {
		return 31;
	}

	if (month === '00') {
		return 31;
	}

	if (month === '02') return 29;

	if (['04', '06', '09', '11'].includes(month)) return 30;

	return 31;
}

export function addDays(date: Date, days: number) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}
