function parseTime(time: string): string {
  // Validate time format (expected: XXam or XXpm or HH:MMam or HH:MMpm), case-insensitive
  const timeFormat = /^(\d{1,2})(?::(\d{2}))?(am|pm)$/i;
  const match = time.match(timeFormat);

  if (!match) {
    throw new Error(
      'Invalid time format. Please use "HHam" or "HHpm" or "HH:MMam" or "HH:MMpm".'
    );
  }

  let [_, hourStr, minuteStr, period] = match;
  let hour = parseInt(hourStr);
  let minute = minuteStr ? parseInt(minuteStr) : 0;
  period = period.toLowerCase();

  hour = period === 'pm' ? (hour % 12) + 12 : hour % 12;

  return hour.toString().padStart(2, '0') + ':' + minute.toString().padStart(2, '0');
}

function parseDate(date: string | undefined): string {
  // If input is empty, use today's date
  if (!date) {
    return new Date().toISOString().split('T')[0];
  }

  // Validate date format (expected: YYYY-MM-DD)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error('Invalid date format. Please use "YYYY-MM-DD".');
  }
  return date;
}

/**
 * Sets a meeting date and time.
 *
 * @param date - The date of the meeting in the format "YYYY-MM-DD".
 * @param time - The time of the meeting in the format "HH:MM".
 * @returns The constructed Date object representing the meeting date and time.
 * @throws An error if the constructed date-time is invalid.
 */
export function setMeeting(date: string, time: string): Date {
  const parsedDate = parseDate(date);
  const parsedTime = parseTime(time);

  const datetime = new Date(`${parsedDate}T${parsedTime}:00`);
  // Verify the date is not "Invalid Date"
  if (isNaN(datetime.getTime())) {
    throw new Error('The constructed date-time is invalid.');
  }
  return datetime;
}
