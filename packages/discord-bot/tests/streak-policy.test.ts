import assert from 'node:assert/strict';
import test from 'node:test';
import { projectSubmission } from '../src/domain/streak-policy';
import type { UserStats } from '../src/domain/user';

function user(overrides: Partial<UserStats> = {}): UserStats {
  return {
    discordId: '123',
    username: 'daniel',
    totalPoints: 40,
    currentStreak: 4,
    highestStreak: 6,
    lastSubmissionDate: '2026-08-07',
    ...overrides,
  };
}

test('first submission creates a one-day streak', () => {
  const result = projectSubmission({
    currentUser: null,
    discordId: '123',
    username: 'daniel',
    today: '2026-08-08',
    points: 10,
  });

  assert.equal(result.duplicate, false);
  assert.equal(result.user.currentStreak, 1);
  assert.equal(result.user.totalPoints, 10);
});

test('consecutive-day submission increments the streak', () => {
  const result = projectSubmission({
    currentUser: user(),
    discordId: '123',
    username: 'daniel',
    today: '2026-08-08',
    points: 10,
  });

  assert.equal(result.user.currentStreak, 5);
  assert.equal(result.user.highestStreak, 6);
  assert.equal(result.user.totalPoints, 50);
});

test('missed day resets current streak but preserves highest streak', () => {
  const result = projectSubmission({
    currentUser: user({ lastSubmissionDate: '2026-08-05' }),
    discordId: '123',
    username: 'daniel',
    today: '2026-08-08',
    points: 10,
  });

  assert.equal(result.user.currentStreak, 1);
  assert.equal(result.user.highestStreak, 6);
});

test('same-day submission is a duplicate and awards no points', () => {
  const result = projectSubmission({
    currentUser: user({ lastSubmissionDate: '2026-08-08' }),
    discordId: '123',
    username: 'daniel',
    today: '2026-08-08',
    points: 10,
  });

  assert.equal(result.duplicate, true);
  assert.equal(result.pointsAwarded, 0);
  assert.equal(result.user.totalPoints, 40);
});
