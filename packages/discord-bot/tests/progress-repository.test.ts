import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { migrateDatabase } from '../src/infrastructure/database/migrations';
import { SqliteDatabase } from '../src/infrastructure/database/sqlite-database';
import { SqliteProgressRepository } from '../src/infrastructure/database/sqlite-progress-repository';

test('duplicate commit rolls back the user update and returns duplicate', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'leetcode-bot-progress-'));
  const database = SqliteDatabase.open(path.join(tempDir, 'test.sqlite'));

  try {
    migrateDatabase(database, [{ url: 'https://leetcode.com/problems/two-sum/', type: 'Array' }]);
    const repository = new SqliteProgressRepository(database);

    const first = await repository.commitSubmission({
      user: {
        discordId: '123',
        username: 'daniel',
        totalPoints: 10,
        currentStreak: 1,
        highestStreak: 1,
        lastSubmissionDate: '2026-08-08',
      },
      dailyProblemId: 1,
      problemName: 'Two Sum',
      codeSnippet: 'first',
      submissionDate: '2026-08-08',
      createdAt: '2026-08-08T12:00:00.000Z',
      pointsAwarded: 10,
    });

    const duplicate = await repository.commitSubmission({
      user: {
        discordId: '123',
        username: 'daniel',
        totalPoints: 999,
        currentStreak: 99,
        highestStreak: 99,
        lastSubmissionDate: '2026-08-08',
      },
      dailyProblemId: 1,
      problemName: 'Two Sum',
      codeSnippet: 'second',
      submissionDate: '2026-08-08',
      createdAt: '2026-08-08T12:01:00.000Z',
      pointsAwarded: 10,
    });

    const stored = await repository.findUser('123');
    assert.equal(first, 'created');
    assert.equal(duplicate, 'duplicate');
    assert.equal(stored?.totalPoints, 10);
    assert.equal(stored?.currentStreak, 1);
  } finally {
    database.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
