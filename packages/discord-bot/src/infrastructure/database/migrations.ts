import type { SqliteDatabase } from './sqlite-database';

export interface DailyProblemSeed {
  url: string;
  type: string;
}

interface TableColumnRow {
  name: string;
}

interface CountRow {
  count: number;
}

function hasColumn(database: SqliteDatabase, table: string, column: string): boolean {
  const rows = database.all<TableColumnRow>(`PRAGMA table_info(${table})`);
  return rows.some((row) => row.name === column);
}

function ensureColumn(
  database: SqliteDatabase,
  table: string,
  column: string,
  definition: string,
): void {
  if (!hasColumn(database, table, column)) {
    database.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}

export function migrateDatabase(database: SqliteDatabase, seed: readonly DailyProblemSeed[]): void {
  database.exec('PRAGMA foreign_keys = ON;');
  database.exec('PRAGMA journal_mode = WAL;');

  database.exec(`
        CREATE TABLE IF NOT EXISTS users (
            discord_id TEXT PRIMARY KEY,
            username TEXT NOT NULL,
            total_points INTEGER NOT NULL DEFAULT 0,
            current_streak INTEGER NOT NULL DEFAULT 0,
            highest_streak INTEGER NOT NULL DEFAULT 0,
            last_submit_date TEXT
        );

        CREATE TABLE IF NOT EXISTS submissions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            discord_id TEXT NOT NULL,
            problem_name TEXT NOT NULL,
            code_snippet TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            points_awarded INTEGER NOT NULL,
            submission_date TEXT,
            daily_problem_id INTEGER,
            FOREIGN KEY (discord_id) REFERENCES users(discord_id)
        );

        CREATE TABLE IF NOT EXISTS daily_problems (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL UNIQUE,
            type TEXT NOT NULL,
            is_completed INTEGER NOT NULL DEFAULT 0,
            assigned_date TEXT
        );
    `);

  ensureColumn(database, 'submissions', 'submission_date', 'TEXT');
  ensureColumn(database, 'submissions', 'daily_problem_id', 'INTEGER');
  ensureColumn(database, 'daily_problems', 'assigned_date', 'TEXT');

  database.exec(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_submission_user_date
        ON submissions(discord_id, submission_date)
        WHERE submission_date IS NOT NULL;

        CREATE INDEX IF NOT EXISTS idx_daily_assignment
        ON daily_problems(assigned_date, is_completed, id);
    `);

  const countRow = database.get<CountRow>('SELECT COUNT(*) AS count FROM daily_problems');
  const count = countRow?.count ?? 0;

  if (count === 0) {
    if (seed.length === 0) {
      throw new Error(
        'daily_problems is empty and no daily-list.json seed was available. Restore the curated daily-list.json file.',
      );
    }

    database.transaction((tx) => {
      for (const problem of seed) {
        tx.run('INSERT OR IGNORE INTO daily_problems (url, type) VALUES (?, ?)', [
          problem.url,
          problem.type,
        ]);
      }
    });
  }
}
