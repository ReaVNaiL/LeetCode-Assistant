import type { UserStats } from './user';

export interface SubmissionResult {
  pointsAwarded: number;
  currentStreak: number;
  totalPoints: number;
  duplicate: boolean;
}

export interface SubmissionCommit {
  user: UserStats;
  dailyProblemId: number;
  problemName: string;
  codeSnippet: string;
  submissionDate: string;
  createdAt: string;
  pointsAwarded: number;
}

export type SubmissionCommitResult = 'created' | 'duplicate';
