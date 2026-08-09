import type {
  DailyProblemRecord,
  DailyProblemRepository,
} from '../../application/ports/daily-problem-repository';
import type { DailyProgress } from '../../domain/problem';
import type { SqliteDatabase, SqliteExecutor } from './sqlite-database';

interface DailyProblemRow {
  id: number;
  url: string;
  type: string;
}

interface ProgressRow {
  used: number | null;
  total: number;
}

const SELECT_ACTIVE_FOR_DATE = `
    SELECT id, url, type
    FROM daily_problems
    WHERE assigned_date = ? AND is_completed = 0
    ORDER BY id DESC
    LIMIT 1
`;

const SELECT_NEXT_UNUSED = `
    SELECT id, url, type
    FROM daily_problems
    WHERE assigned_date IS NULL AND is_completed = 0
    ORDER BY id ASC
    LIMIT 1
`;

function assignNext(tx: SqliteExecutor, date: string): DailyProblemRecord | null {
  const next = tx.get<DailyProblemRow>(SELECT_NEXT_UNUSED);
  if (!next) {
    return null;
  }

  tx.run('UPDATE daily_problems SET assigned_date = ? WHERE id = ?', [date, next.id]);
  return next;
}

export class SqliteDailyProblemRepository implements DailyProblemRepository {
  constructor(private readonly database: SqliteDatabase) {}

  async getOrAssignForDate(date: string): Promise<DailyProblemRecord | null> {
    return this.database.transaction((tx) => {
      const active = tx.get<DailyProblemRow>(SELECT_ACTIVE_FOR_DATE, [date]);
      return active ?? assignNext(tx, date);
    });
  }

  async skipForDate(date: string): Promise<DailyProblemRecord | null> {
    return this.database.transaction((tx) => {
      let active: DailyProblemRecord | null =
        tx.get<DailyProblemRow>(SELECT_ACTIVE_FOR_DATE, [date]) ?? null;

      if (!active) {
        active = assignNext(tx, date);
      }

      if (!active) {
        return null;
      }

      const replacement = tx.get<DailyProblemRow>(SELECT_NEXT_UNUSED);
      if (!replacement) {
        return null;
      }

      tx.run('UPDATE daily_problems SET is_completed = 1 WHERE id = ?', [active.id]);
      tx.run('UPDATE daily_problems SET assigned_date = ? WHERE id = ?', [date, replacement.id]);
      return replacement;
    });
  }

  async getProgress(): Promise<DailyProgress> {
    const row = this.database.get<ProgressRow>(`
            SELECT
                SUM(CASE WHEN assigned_date IS NOT NULL OR is_completed = 1 THEN 1 ELSE 0 END) AS used,
                COUNT(*) AS total
            FROM daily_problems
        `);

    return {
      used: Number(row?.used ?? 0),
      total: Number(row?.total ?? 0),
    };
  }
}
