import type { ProgressRepository } from '../../application/ports/progress-repository';
import type { SubmissionCommit, SubmissionCommitResult } from '../../domain/submission';
import type { LeaderboardEntry, UserProfile, UserStats } from '../../domain/user';
import type { SqliteDatabase } from './sqlite-database';

interface UserRow {
  discord_id: string;
  username: string;
  total_points: number;
  current_streak: number;
  highest_streak: number;
  last_submit_date: string | null;
}

interface ProfileRow extends UserRow {
  problems_solved: number;
}

interface LeaderboardRow {
  username: string;
  total_points: number;
  current_streak: number;
}

class DuplicateSubmissionError extends Error {}

function mapUser(row: UserRow): UserStats {
  return {
    discordId: row.discord_id,
    username: row.username,
    totalPoints: row.total_points,
    currentStreak: row.current_streak,
    highestStreak: row.highest_streak,
    lastSubmissionDate: row.last_submit_date,
  };
}

function isDuplicateConstraint(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }
  return (
    error.message.includes('UNIQUE constraint failed') && error.message.includes('submissions')
  );
}

export class SqliteProgressRepository implements ProgressRepository {
  constructor(private readonly database: SqliteDatabase) {}

  async findUser(discordId: string): Promise<UserStats | null> {
    const row = this.database.get<UserRow>('SELECT * FROM users WHERE discord_id = ?', [discordId]);
    return row ? mapUser(row) : null;
  }

  async commitSubmission(input: SubmissionCommit): Promise<SubmissionCommitResult> {
    try {
      this.database.transaction((tx) => {
        tx.run(
          `
                        INSERT INTO users (
                            discord_id, username, total_points, current_streak,
                            highest_streak, last_submit_date
                        ) VALUES (?, ?, ?, ?, ?, ?)
                        ON CONFLICT(discord_id) DO UPDATE SET
                            username = excluded.username,
                            total_points = excluded.total_points,
                            current_streak = excluded.current_streak,
                            highest_streak = excluded.highest_streak,
                            last_submit_date = excluded.last_submit_date
                    `,
          [
            input.user.discordId,
            input.user.username,
            input.user.totalPoints,
            input.user.currentStreak,
            input.user.highestStreak,
            input.user.lastSubmissionDate,
          ],
        );

        try {
          tx.run(
            `
                            INSERT INTO submissions (
                                discord_id, problem_name, code_snippet, timestamp,
                                points_awarded, submission_date, daily_problem_id
                            ) VALUES (?, ?, ?, ?, ?, ?, ?)
                        `,
            [
              input.user.discordId,
              input.problemName,
              input.codeSnippet,
              input.createdAt,
              input.pointsAwarded,
              input.submissionDate,
              input.dailyProblemId,
            ],
          );
        } catch (error) {
          if (isDuplicateConstraint(error)) {
            throw new DuplicateSubmissionError();
          }
          throw error;
        }
      });
      return 'created';
    } catch (error) {
      if (error instanceof DuplicateSubmissionError) {
        return 'duplicate';
      }
      throw error;
    }
  }

  async getProfile(discordId: string): Promise<UserProfile | null> {
    const row = this.database.get<ProfileRow>(
      `
                SELECT
                    u.*,
                    COUNT(s.id) AS problems_solved
                FROM users u
                LEFT JOIN submissions s ON s.discord_id = u.discord_id
                WHERE u.discord_id = ?
                GROUP BY u.discord_id
            `,
      [discordId],
    );

    if (!row) {
      return null;
    }

    return {
      ...mapUser(row),
      problemsSolved: row.problems_solved,
    };
  }

  async getLeaderboard(limit: number): Promise<LeaderboardEntry[]> {
    const rows = this.database.all<LeaderboardRow>(
      `
                SELECT username, total_points, current_streak
                FROM users
                ORDER BY total_points DESC, highest_streak DESC, username ASC
                LIMIT ?
            `,
      [limit],
    );

    return rows.map((row) => ({
      username: row.username,
      totalPoints: row.total_points,
      currentStreak: row.current_streak,
    }));
  }

  async resetStreaksBefore(cutoffDate: string): Promise<number> {
    const result = this.database.run(
      `
                UPDATE users
                SET current_streak = 0
                WHERE current_streak <> 0
                  AND last_submit_date IS NOT NULL
                  AND last_submit_date < ?
            `,
      [cutoffDate],
    );
    return result.changes;
  }
}
