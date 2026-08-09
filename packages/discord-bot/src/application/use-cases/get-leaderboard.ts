import type { LeaderboardEntry } from '../../domain/user';
import type { ProgressRepository } from '../ports/progress-repository';

export class GetLeaderboard {
  constructor(private readonly progress: ProgressRepository) {}

  execute(limit = 10): Promise<LeaderboardEntry[]> {
    return this.progress.getLeaderboard(limit);
  }
}
