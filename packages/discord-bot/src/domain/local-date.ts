const LOCAL_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const DAY_MS = 24 * 60 * 60 * 1000;

function toUtcDay(value: string): number {
  const match = LOCAL_DATE_PATTERN.exec(value);
  if (!match) {
    throw new Error(`Invalid local date: ${value}`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  return Date.UTC(year, month - 1, day);
}

export function daysBetween(earlier: string, later: string): number {
  return Math.round((toUtcDay(later) - toUtcDay(earlier)) / DAY_MS);
}

export function subtractDays(value: string, days: number): string {
  const date = new Date(toUtcDay(value) - days * DAY_MS);
  return date.toISOString().slice(0, 10);
}
