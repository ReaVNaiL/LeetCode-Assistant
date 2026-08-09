import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { migrateDatabase } from '../src/infrastructure/database/migrations';
import { SqliteDailyProblemRepository } from '../src/infrastructure/database/sqlite-daily-problem-repository';
import { SqliteDatabase } from '../src/infrastructure/database/sqlite-database';

test('daily assignment is stable for a date and advances on the next date', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'leetcode-bot-'));
  const database = await SqliteDatabase.open(path.join(tempDir, 'test.sqlite'));

  try {
    await migrateDatabase(database, [
      { url: 'https://leetcode.com/problems/two-sum/', type: 'Array' },
      { url: 'https://leetcode.com/problems/add-two-numbers/', type: 'Linked List' },
      {
        url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        type: 'String',
      },
    ]);
    const repository = new SqliteDailyProblemRepository(database);

    const first = await repository.getOrAssignForDate('2026-08-08');
    const repeated = await repository.getOrAssignForDate('2026-08-08');
    const tomorrow = await repository.getOrAssignForDate('2026-08-09');

    assert.equal(first?.id, repeated?.id);
    assert.notEqual(first?.id, tomorrow?.id);
  } finally {
    await database.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('skip replaces the active problem for the same date', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'leetcode-bot-'));
  const database = await SqliteDatabase.open(path.join(tempDir, 'test.sqlite'));

  try {
    await migrateDatabase(database, [
      { url: 'https://leetcode.com/problems/two-sum/', type: 'Array' },
      { url: 'https://leetcode.com/problems/add-two-numbers/', type: 'Linked List' },
    ]);
    const repository = new SqliteDailyProblemRepository(database);

    const first = await repository.getOrAssignForDate('2026-08-08');
    const replacement = await repository.skipForDate('2026-08-08');
    const repeated = await repository.getOrAssignForDate('2026-08-08');

    assert.notEqual(first?.id, replacement?.id);
    assert.equal(replacement?.id, repeated?.id);
  } finally {
    await database.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('skip does not consume the final remaining assignment when no replacement exists', async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'leetcode-bot-'));
  const database = SqliteDatabase.open(path.join(tempDir, 'test.sqlite'));

  try {
    migrateDatabase(database, [{ url: 'https://leetcode.com/problems/two-sum/', type: 'Array' }]);
    const repository = new SqliteDailyProblemRepository(database);

    const current = await repository.getOrAssignForDate('2026-08-08');
    const replacement = await repository.skipForDate('2026-08-08');
    const stillCurrent = await repository.getOrAssignForDate('2026-08-08');

    assert.equal(replacement, null);
    assert.equal(stillCurrent?.id, current?.id);
  } finally {
    database.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
