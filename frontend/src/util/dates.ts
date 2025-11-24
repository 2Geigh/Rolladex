import { parseISO, isValid, differenceInDays } from 'date-fns';

function validateDate(dateString: string): boolean {
    const date = parseISO(dateString);
    return isValid(date);
}

function daysSinceDate(date: string): number {
    
    const previous_date = new Date(date)
    const today = new Date();

    return differenceInDays(today, previous_date)

}

export { validateDate, daysSinceDate }
