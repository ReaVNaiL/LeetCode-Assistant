import type { Clock } from '../../application/ports/clock';

export class SystemClock implements Clock {
  private readonly formatter: Intl.DateTimeFormat;

  constructor(timeZone: string) {
    this.formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  now(): Date {
    return new Date();
  }

  today(): string {
    const parts = this.formatter.formatToParts(this.now());
    const get = (type: Intl.DateTimeFormatPartTypes): string =>
      parts.find((part) => part.type === type)?.value ?? '';

    return `${get('year')}-${get('month')}-${get('day')}`;
  }
}
