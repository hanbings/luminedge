const dayMilliseconds = 24 * 60 * 60 * 1000;

/** Construct a UTC date without the Date constructor's special handling of years 0–99. */
export function calendarDate(year: number, month: number, day: number): Date {
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month, day);
  return date;
}

export function parseCalendarDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  if (year < 1 || month < 0 || month > 11 || day < 1) return null;
  const date = calendarDate(year, month, day);
  return date.getUTCFullYear() === year && date.getUTCMonth() === month && date.getUTCDate() === day ? date : null;
}

export function formatCalendarDate(date: Date): string {
  const year = date.getUTCFullYear();
  if (year < 1 || year > 9999 || Number.isNaN(date.getTime())) throw new Error('Calendar date is outside the supported range.');
  return `${String(year).padStart(4, '0')}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

export function addCalendarDays(date: Date, days: number): Date | null {
  const result = new Date(date.getTime() + days * dayMilliseconds);
  return result.getUTCFullYear() >= 1 && result.getUTCFullYear() <= 9999 ? result : null;
}

export function addCalendarMonths(date: Date, months: number): Date | null {
  const first = calendarDate(date.getUTCFullYear(), date.getUTCMonth() + months, 1);
  const year = first.getUTCFullYear();
  if (year < 1 || year > 9999) return null;
  const month = first.getUTCMonth();
  const lastDay = calendarDate(year, month + 1, 0).getUTCDate();
  return calendarDate(year, month, Math.min(date.getUTCDate(), lastDay));
}
