import { listen } from '@luminedge/tools';
import { addCalendarDays, addCalendarMonths, calendarDate, formatCalendarDate, parseCalendarDate } from './calendar-date.js';

export interface CalendarOptions {
  value?: string;
  min?: string;
  max?: string;
  locale?: string;
}
export interface CalendarController {
  getDate(): string | null;
  setDate(value: string | null): boolean;
  destroy(): void;
}

/** Enhance a calendar using ISO dates. Dates are compared in UTC to avoid DST shifts. */
export function createCalendar(root: HTMLElement, options: CalendarOptions = {}): CalendarController {
  const label = root.querySelector<HTMLElement>('[data-calendar-label]');
  const previous = root.querySelector<HTMLButtonElement>('[data-calendar-previous]');
  const next = root.querySelector<HTMLButtonElement>('[data-calendar-next]');
  const table = root.querySelector<HTMLTableElement>('[data-calendar-grid]');
  const weekdays = root.querySelector<HTMLTableRowElement>('[data-calendar-weekdays]');
  const body = root.querySelector<HTMLTableSectionElement>('[data-calendar-body]');
  if (!label || !previous || !next || !table || !weekdays || !body) throw new Error('Calendar is missing required elements.');

  const parseOption = (value: string | undefined, name: string) => {
    if (value === undefined) return null;
    const date = parseCalendarDate(value);
    if (!date) throw new Error(`Invalid calendar ${name}: ${value}`);
    return date;
  };
  const min = parseOption(options.min, 'minimum');
  const max = parseOption(options.max, 'maximum');
  if (min && max && min > max) throw new Error('Calendar minimum cannot be after maximum.');
  let selected = parseOption(options.value, 'value');
  const inRange = (date: Date) => (!min || date >= min) && (!max || date <= max);
  if (selected && !inRange(selected)) throw new Error('Calendar value is outside its range.');
  const clamp = (date: Date) => min && date < min ? min : max && date > max ? max : date;
  const now = new Date();
  const today = calendarDate(now.getFullYear(), now.getMonth(), now.getDate());
  let focused = selected ?? clamp(today);
  const locale = options.locale || root.closest<HTMLElement>('[lang]')?.lang || undefined;
  const monthFormatter = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', timeZone: 'UTC' });
  const dayFormatter = new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: 'UTC' });
  const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' });
  const document = root.ownerDocument;

  // 1 January 2024 was a Monday; the calendar consistently starts the week on Monday.
  weekdays.replaceChildren(...Array.from({ length: 7 }, (_, i) => {
    const th = document.createElement('th');
    th.scope = 'col';
    th.textContent = weekdayFormatter.format(calendarDate(2024, 0, i + 1));
    return th;
  }));

  const monthAvailable = (date: Date | null) => {
    if (!date) return false;
    const first = calendarDate(date.getUTCFullYear(), date.getUTCMonth(), 1);
    const last = calendarDate(date.getUTCFullYear(), date.getUTCMonth() + 1, 0);
    return (!min || last >= min) && (!max || first <= max);
  };

  const render = () => {
    const year = focused.getUTCFullYear();
    const month = focused.getUTCMonth();
    const first = calendarDate(year, month, 1);
    const offset = (first.getUTCDay() + 6) % 7;
    const days = calendarDate(year, month + 1, 0).getUTCDate();
    const cells = Math.ceil((offset + days) / 7) * 7;
    const monthName = monthFormatter.format(focused);
    label.textContent = monthName;
    table.setAttribute('aria-label', monthName);
    previous.disabled = !monthAvailable(addCalendarMonths(first, -1));
    next.disabled = !monthAvailable(addCalendarMonths(first, 1));
    const rows: HTMLTableRowElement[] = [];
    for (let i = 0; i < cells; i += 1) {
      if (i % 7 === 0) rows.push(document.createElement('tr'));
      const cell = document.createElement('td');
      const day = i - offset + 1;
      if (day >= 1 && day <= days) {
        const date = calendarDate(year, month, day);
        const value = formatCalendarDate(date);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'le-calendar-day';
        button.dataset.calendarDate = value;
        button.textContent = String(day);
        button.disabled = !inRange(date);
        button.tabIndex = date.getTime() === focused.getTime() ? 0 : -1;
        button.setAttribute('aria-label', dayFormatter.format(date));
        button.setAttribute('aria-pressed', String(!!selected && date.getTime() === selected.getTime()));
        if (date.getTime() === today.getTime()) button.setAttribute('aria-current', 'date');
        cell.append(button);
      }
      rows[rows.length - 1].append(cell);
    }
    body.replaceChildren(...rows);
  };
  const focusDay = () => root.querySelector<HTMLButtonElement>(`button[data-calendar-date="${formatCalendarDate(focused)}"]`)?.focus();
  const notify = () => root.dispatchEvent(new CustomEvent('le:datechange', { bubbles: true, detail: { value: selected ? formatCalendarDate(selected) : null } }));
  const setSelection = (date: Date | null, focus: boolean) => {
    const changed = selected?.getTime() !== date?.getTime();
    selected = date;
    if (date) focused = date;
    render();
    if (focus) focusDay();
    if (changed) notify();
  };
  const moveMonth = (amount: number) => {
    const target = addCalendarMonths(focused, amount);
    if (!target || !monthAvailable(target)) return;
    focused = clamp(target);
    const active = document.activeElement;
    render();
    if ((active === previous && previous.disabled) || (active === next && next.disabled)) focusDay();
  };
  render();

  const cleanup = [
    listen(previous, 'click', () => moveMonth(-1)),
    listen(next, 'click', () => moveMonth(1)),
    listen(table, 'click', (event) => {
      const target = (event.target as Element | null)?.closest<HTMLButtonElement>('button[data-calendar-date]');
      if (!target || !table.contains(target) || target.disabled) return;
      const date = parseCalendarDate(target.dataset.calendarDate ?? '');
      if (date) setSelection(date, true);
    }),
    listen(table, 'keydown', (event) => {
      const keyboard = event as KeyboardEvent;
      const target = (event.target as Element | null)?.closest<HTMLButtonElement>('button[data-calendar-date]');
      if (!target || !table.contains(target)) return;
      const date = parseCalendarDate(target.dataset.calendarDate ?? '');
      if (!date) return;
      let destination: Date | null;
      switch (keyboard.key) {
        case 'ArrowLeft': destination = addCalendarDays(date, -1); break;
        case 'ArrowRight': destination = addCalendarDays(date, 1); break;
        case 'ArrowUp': destination = addCalendarDays(date, -7); break;
        case 'ArrowDown': destination = addCalendarDays(date, 7); break;
        case 'Home': destination = addCalendarDays(date, -((date.getUTCDay() + 6) % 7)); break;
        case 'End': destination = addCalendarDays(date, 6 - ((date.getUTCDay() + 6) % 7)); break;
        case 'PageUp': destination = addCalendarMonths(date, keyboard.shiftKey ? -12 : -1); break;
        case 'PageDown': destination = addCalendarMonths(date, keyboard.shiftKey ? 12 : 1); break;
        default: return;
      }
      keyboard.preventDefault();
      if (!destination) return;
      focused = clamp(destination);
      render();
      focusDay();
    }),
  ];
  return {
    getDate: () => selected ? formatCalendarDate(selected) : null,
    setDate(value) {
      const date = value === null ? null : parseCalendarDate(value);
      if (value !== null && (!date || !inRange(date))) return false;
      setSelection(date, false);
      return true;
    },
    destroy: () => cleanup.forEach((remove) => remove()),
  };
}
