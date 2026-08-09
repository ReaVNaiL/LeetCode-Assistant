import type { SubmissionCommit, SubmissionCommitResult } from '../../domain/submission';
import type { LeaderboardEntry, UserProfile, UserStats } from '../../domain/user';

export interface ProgressRepository {
  findUser(discordId: string): Promise<UserStats | null>;
  commitSubmission(input: SubmissionCommit): Promise<SubmissionCommitResult>;
  getProfile(discordId: string): Promise<UserProfile | null>;
  getLeaderboard(limit: number): Promise<LeaderboardEntry[]>;
  resetStreaksBefore(cutoffDate: string): Promise<number>;
}
