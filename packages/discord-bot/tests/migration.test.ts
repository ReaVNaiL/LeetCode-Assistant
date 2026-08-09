import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { migrateDatabase } from '../src/infrastructure/database/migrations';
import { SqliteDatabase } from '../src/infrastructure/database/sqlite-database';

interface ColumnRow {
  name: string;
}

interface CountRow {
  count: number;
}

test('migration upgrades the legacy schema without deleting existing rows', () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'leetcode-bot-migration-'));
  const database = SqliteDatabase.open(path.join(tempDir, 'legacy.sqlite'));

  try {
    database.exec(`
            CREATE TABLE users (
                discord_id TEXT PRIMARY KEY,
                username TEXT,
                total_points INTEGER DEFAULT 0,
                current_streak INTEGER DEFAULT 0,
                highest_streak INTEGER DEFAULT 0,
                last_submit_date TEXT
            );

            CREATE TABLE submissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                discord_id TEXT,
                problem_name TEXT,
                code_snippet TEXT,
                timestamp TEXT,
                points_awarded INTEGER
            );

            CREATE TABLE daily_problems (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT UNIQUE,
                type TEXT,
                is_completed BOOLEAN DEFAULT 0
            );

            INSERT INTO users VALUES ('123', 'daniel', 30, 3, 5, '2026-08-07');
            INSERT INTO daily_problems (url, type, is_completed)
                VALUES ('https://leetcode.com/problems/two-sum/', 'Array', 0);
        `);

    migrateDatabase(database, []);

    const submissionColumns = database.all<ColumnRow>('PRAGMA table_info(submissions)');
    const dailyColumns = database.all<ColumnRow>('PRAGMA table_info(daily_problems)');
    const userCount = database.get<CountRow>('SELECT COUNT(*) AS count FROM users');
    const dailyCount = database.get<CountRow>('SELECT COUNT(*) AS count FROM daily_problems');

    assert.ok(submissionColumns.some((column) => column.name === 'submission_date'));
    assert.ok(submissionColumns.some((column) => column.name === 'daily_problem_id'));
    assert.ok(dailyColumns.some((column) => column.name === 'assigned_date'));
    assert.equal(userCount?.count, 1);
    assert.equal(dailyCount?.count, 1);
  } finally {
    database.close();
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});
