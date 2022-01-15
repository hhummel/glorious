import { DateObj, DateConstraints } from '../../types';

/**
 * TODO: Hard-coded exclusion of all days except Tuesdays and Fridays
 * TODO: Should vary by product, include allowed days and vacation weeks
 * TODO: Could be aware of capacity limits
 * TODO: Should depend on shipping
 */


/**
* Tests if date is disabled. Hard-coded for excluded days of the week
*/
/**
 * 
 * @param date - Test if this date should be disabled
 * @returns - (date) => bool that has contraints inclosure
 */

export default function isDisabledDate(constraints: DateConstraints): (date: Date) => boolean {
    function isDisabled (date: Date) {
        const dateObj: DateObj = {"year": date.getFullYear(), "month": date.getMonth(), "date": date.getDate()};
        if (constraints.disablePast && date < new Date()) return true;
        if (_hasDate(constraints.enabledDates, dateObj)) return false;
        if (_hasDate(constraints.disabledDates, dateObj)) return true;
        return constraints.disabledDays.includes(date.getDay());
    }
    return isDisabled
}

const _compareDates = (d1: DateObj, d2: DateObj) => d1.year === d2.year && d1.month === d2.month && d1.date == d2.date; 
const _hasDate = (arr: Array<DateObj>, date: DateObj) => arr.every(d => _compareDates(d, date))

