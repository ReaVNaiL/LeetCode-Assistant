import type { DailyProblem, DailyProgress, Problem } from '../domain/problem';
import type { SubmissionResult } from '../domain/submission';
import type { LeaderboardEntry, UserProfile } from '../domain/user';
import type { GetBonusProblem } from './use-cases/get-bonus-problem';
import type { GetDailyProblem } from './use-cases/get-daily-problem';
import type { GetDailyProgress } from './use-cases/get-daily-progress';
import type { GetLeaderboard } from './use-cases/get-leaderboard';
import type { GetUserProfile } from './use-cases/get-user-profile';
import type { ResetMissedStreaks } from './use-cases/reset-missed-streaks';
import type { SkipDailyProblem } from './use-cases/skip-daily-problem';
import type { SubmitSolution, SubmitSolutionCommand } from './use-cases/submit-solution';

export class LeetCodeApplication {
  constructor(
    private readonly getDailyProblemUseCase: GetDailyProblem,
    private readonly getBonusProblemUseCase: GetBonusProblem,
    private readonly skipDailyProblemUseCase: SkipDailyProblem,
    private readonly submitSolutionUseCase: SubmitSolution,
    private readonly getLeaderboardUseCase: GetLeaderboard,
    private readonly getUserProfileUseCase: GetUserProfile,
    private readonly getDailyProgressUseCase: GetDailyProgress,
    private readonly resetMissedStreaksUseCase: ResetMissedStreaks,
  ) {}

  getDailyProblem(): Promise<DailyProblem> {
    return this.getDailyProblemUseCase.execute();
  }

  getBonusProblem(): Promise<Problem> {
    return this.getBonusProblemUseCase.execute();
  }

  skipDailyProblem(): Promise<DailyProblem> {
    return this.skipDailyProblemUseCase.execute();
  }

  submitSolution(command: SubmitSolutionCommand): Promise<SubmissionResult> {
    return this.submitSolutionUseCase.execute(command);
  }

  getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
    return this.getLeaderboardUseCase.execute(limit);
  }

  getUserProfile(discordId: string): Promise<UserProfile | null> {
    return this.getUserProfileUseCase.execute(discordId);
  }

  getDailyProgress(): Promise<DailyProgress> {
    return this.getDailyProgressUseCase.execute();
  }

  resetMissedStreaks(): Promise<number> {
    return this.resetMissedStreaksUseCase.execute();
  }
}
