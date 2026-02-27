/**
 * @returns `true` if the year is leap (number divided by 4 without remainder)
 *
 * @param year takes any number what will be divided by 4.
 *
 * @example
 * isLeap(2028); // true
 * isLeap(2020); // true
 * isLeap(2026); // false
 */
function isLeap(year: number): boolean {
  return (year % 4) == 0;
}

/**
 * @returns A literal name of the month by given number, or an empty string if the number is not in the range 0-11.
 *
 * @param month an integer in range 0 to 11.
 *
 * @example
 * formatting(0); // January
 * formatting(11); // December
 * formatting(12) // '' (out of range)
 */
function monthToString(month: number): string {
  const months: Record<number, string> = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
  };

  if (0 <= month && month <= 11)
    return months[month] as string;
  return ''
}

/**
 * @returns A formatted hours:time from 24-hour time format to 12-hour or an empty string if params are out of range.
 *
 * @param hours takes a number in range from `0` to `23`.
 *
 * @param minutes takes a number in range from `0` to `59`, default value is `0`;
 *
 * @example
 * formatTime(8); // '8:00 AM'
 *
 * @example
 * formatTime(13, 37); // '1:37 PM'
 *
 * @example
 * formatTime(24, 42) // '' (out of range)
 */
function formatTime(hours: number, minutes: number = 0): string {
  let formattedMinutes = minutes.toString();
  if (minutes < 10) {
    formattedMinutes = `0${minutes}`;
  }

  if (23 < hours || hours < 0) return ''; // 0-23
  if (59 < minutes || minutes < 0) return ''; // 0-59

  if ((hours - 12) > 0)
    return `${hours - 12}:${formattedMinutes} PM`;
  else
    return `${hours}:${formattedMinutes} AM`;
}

/**
 * @returns a Formatted date by day`separator`month`separator`year`separator` format
 * or an empty string if given params are wrong
 *
 * @param day takes a `number` in range from `1` to `31`.
 *
 * @param month takes a `number` in range from `0` to `11`.
 *
 * @param year takes any `number`
 *
 * @param separator takes a `string` what will separate `day`, `month` and `year`,
 * default value is '.'
 *
 * @param stringifyMonth an optional param, it takes a `boolean`,
 * if the value is set to `true`, month will be returned as a word.
 *
 * @param cutMonth an optional param, it takes a `boolean`,
 * if the value is set to `true`, only three letters will be returned as month in date.
 *
 * **Note:** if `stringifyMonth` is not set or `false`, function will add an `1` to display month correctly
 * for ex. 1.0.2026 -> 1.1.2026 etc.
 *
 * @example
 * formatDate(27, 0, 2026);                 // 27.1.2026
 * formatDate(24, 1, 2022, '-');            // 24-2-2022
 * formatDate(10, 2, 2020, " ", true)       // 10 March 2020
 * formatDate(30, 3, 2016, " ", true, true) // 30 Apr 2016
 * formatDate(33, 4, 2009)                  // '' (out of range)
 */
function formatDate(
  day: number,
  month: number,
  year: number,
  separator: string = '.',
  stringifyMonth?: boolean,
  cutMonth?: boolean
): string {

  const daysInMonths: Record<number, number> = {
    0: 31,
    1: 29,
    2: 31,
    3: 30,
    4: 31,
    5: 30,
    6: 31,
    7: 31,
    8: 30,
    9: 31,
    10: 30,
    11: 31
  };

  if (11 < month || day < 0) return ''; // 0-11
  if (daysInMonths[month] !== undefined)
    if (daysInMonths[month] < day || day > daysInMonths[month]) return '';

  if (stringifyMonth) {
    const stringifiedMonth = monthToString(month);
    if (cutMonth) {
      return `${day}${separator}${stringifiedMonth.slice(0, 3)}${separator}${year}`;
    }
    return `${day}${separator}${stringifiedMonth}${separator}${year}`;
  }
  return `${day}${separator}${month + 1}${separator}${year}`;
}

export { formatTime, formatDate }