import { subtractDays } from '../../domain/local-date';
import type { Clock } from '../ports/clock';
import type { ProgressRepository } from '../ports/progress-repository';

export class ResetMissedStreaks {
  constructor(
    private readonly progress: ProgressRepository,
    private readonly clock: Clock,
  ) {}

  execute(): Promise<number> {
    const yesterday = subtractDays(this.clock.today(), 1);
    return this.progress.resetStreaksBefore(yesterday);
  }
}
