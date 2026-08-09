import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync, type SQLInputValue } from 'node:sqlite';

export interface RunResult {
  lastID: number;
  changes: number;
}

export interface SqliteExecutor {
  run(sql: string, params?: readonly SQLInputValue[]): RunResult;
  get<T>(sql: string, params?: readonly SQLInputValue[]): T | undefined;
  all<T>(sql: string, params?: readonly SQLInputValue[]): T[];
  exec(sql: string): void;
}

export class SqliteDatabase implements SqliteExecutor {
  private readonly connection: DatabaseSync;

  private constructor(databasePath: string) {
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
    this.connection = new DatabaseSync(databasePath, {
      timeout: 5_000,
      enableForeignKeyConstraints: true,
    });
  }

  static open(databasePath: string): SqliteDatabase {
    return new SqliteDatabase(databasePath);
  }

  run(sql: string, params: readonly SQLInputValue[] = []): RunResult {
    const result = this.connection.prepare(sql).run(...params);
    return {
      lastID: Number(result.lastInsertRowid),
      changes: Number(result.changes),
    };
  }

  get<T>(sql: string, params: readonly SQLInputValue[] = []): T | undefined {
    return this.connection.prepare(sql).get(...params) as T | undefined;
  }

  all<T>(sql: string, params: readonly SQLInputValue[] = []): T[] {
    return this.connection.prepare(sql).all(...params) as T[];
  }

  exec(sql: string): void {
    this.connection.exec(sql);
  }

  transaction<T>(work: (tx: SqliteExecutor) => T): T {
    this.connection.exec('BEGIN IMMEDIATE');
    try {
      const result = work(this);
      this.connection.exec('COMMIT');
      return result;
    } catch (error) {
      try {
        this.connection.exec('ROLLBACK');
      } catch (rollbackError) {
        console.error('SQLite rollback failed:', rollbackError);
      }
      throw error;
    }
  }

  close(): void {
    this.connection.close();
  }
}
