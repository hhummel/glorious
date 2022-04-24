
/**
 * 
 * @param dateString string of form YYYY-mm-dd
 */
export default function formatDateString(dateString: string): string {
    const [year, month, day] = dateString.split('-');
    return new Date(parseInt(year), parseInt(month)-1, parseInt(day), 0, 0, 0).toDateString()

}