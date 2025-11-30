import { parseISO, isValid, differenceInDays } from 'date-fns';
import type { JsonDate } from '../types/jsonDate';

function validateDate(dateString: string): boolean {
    const date = parseISO(dateString);
    return isValid(date);
}

function daysSinceDate(date: JsonDate): number {
    
    const previous_date = new Date(date)
    const today = new Date();

    return differenceInDays(today, previous_date)

}

export { validateDate, daysSinceDate }
