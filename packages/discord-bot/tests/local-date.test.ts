import assert from 'node:assert/strict';
import test from 'node:test';
import { daysBetween, subtractDays } from '../src/domain/local-date';

test('daysBetween is not affected by daylight-saving time', () => {
  assert.equal(daysBetween('2026-03-07', '2026-03-08'), 1);
  assert.equal(daysBetween('2026-11-01', '2026-11-02'), 1);
});

test('subtractDays crosses month boundaries', () => {
  assert.equal(subtractDays('2026-03-01', 1), '2026-02-28');
});
